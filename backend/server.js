const express = require('express');
const cors = require('cors'); // Allows the frontend to talk to the backend
const app = express();

app.use(cors());
app.use(express.json());

app.post('/api/vote', (req, res) => {
    const { candidate } = req.body;

    // 1. Basic Validation
    if (!candidate) {
        return res.status(400).json({ error: "No candidate selected" });
    }

    console.log(`Received vote for: ${candidate}`);

    res.status(200).json({ message: "Vote recorded!" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Voting API listening on port ${PORT}`);
});