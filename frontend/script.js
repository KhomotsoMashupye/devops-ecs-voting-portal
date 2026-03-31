// script.js

let selectedCandidate = null;

// FIXED: Improved URL logic to handle both local dev and AWS ALB routing
const API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:3000/api/vote'
    : '/api/vote'; // In AWS, the ALB handles the routing to /api/vote

function selectCandidate(element, name) {
    document.querySelectorAll('.candidate-option').forEach(el => {
        el.classList.remove('selected');
    });

    element.classList.add('selected');
    selectedCandidate = name;

    document.getElementById('submit-btn').disabled = false;
}

async function castVote() {
    if (!selectedCandidate) return;

    const btn = document.getElementById('submit-btn');
    const status = document.getElementById('status-msg');

    btn.disabled = true;
    status.style.color = "#64748b";
    status.innerText = "Encrypting and submitting ballot...";

    try {
        // FIXED: Changed from 'https://127.0.0.1:3000' to the dynamic API_URL variable
        // Also removed HTTPS for local testing since your Express app is likely HTTP
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ candidate: selectedCandidate })
        });

        if (response.ok) {
            const data = await response.json();
            status.style.color = "#10b981";
            status.innerText = `Success! Your vote has been recorded. Tracking ID: ${data.trackingId}`;
            
            // Optional: Reset selection after success
            selectedCandidate = null;
            document.querySelectorAll('.candidate-option').forEach(el => el.classList.remove('selected'));
        } else {
            const errData = await response.json();
            status.style.color = "#ef4444";
            status.innerText = `Submission failed: ${errData.error || 'Unknown error'}`;
            btn.disabled = false;
        }
    } catch (err) {
        console.error("Fetch Error:", err);
        status.style.color = "#ef4444";
        status.innerText = "Connection error. Ensure the backend is running.";
        btn.disabled = false;
    }
}