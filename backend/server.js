const express = require('express');
const cors = require('cors');
const { SQSClient, SendMessageCommand } = require("@aws-sdk/client-sqs");

const app = express();
app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
    res.status(200).send('OK');
});

const sqsClient = new SQSClient({ region: process.env.AWS_REGION || 'af-south-1' });

app.post('/api/vote', async (req, res) => {
    const { candidate } = req.body;

    if (!candidate) {
        return res.status(400).json({ error: "No candidate selected" });
    }

    try {
        const params = {
            QueueUrl: process.env.SQS_QUEUE_URL,
            MessageBody: JSON.stringify({
                candidate: candidate,
                voterIp: req.ip,
                timestamp: new Date().toISOString()
            }),
            
            MessageAttributes: {
                "VoteType": { 
                    DataType: "String",
                    StringValue: "VoteEntry"
                }
            }
        };

        const data = await sqsClient.send(new SendMessageCommand(params));
        
        console.log(`Vote for ${candidate} queued. ID: ${data.MessageId}`);

        res.status(200).json({ 
            message: "Vote recorded successfully!",
            trackingId: data.MessageId 
        });

    } catch (err) {
        console.error("SQS Error:", err);
        res.status(500).json({ error: "Internal server error. Please try again." });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Voting API listening on port ${PORT}`);
});