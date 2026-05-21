require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
const GROQ_API_KEY = process.env.GROQ_API_KEY;

app.post('/api/analyze', async (req, res) => {
    try {
        const { inputText } = req.body;
        
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${GROQ_API_KEY}`
            },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                max_tokens: 1024,
                messages: [
                    {
                        role: "user",
                        content: `You are an expert career coach. Analyze this resume and give exactly 5 bullet points of specific, actionable feedback for the mentioned roles.\n\nResume:\n${inputText}`
                    }
                ]
            })
        });

        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error("Error in /api/analyze:", error);
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/score', async (req, res) => {
    try {
        const { inputText } = req.body;
        
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${GROQ_API_KEY}`
            },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                max_tokens: 1024,
                messages: [
                    {
                        role: "user",
                        content: `You are an expert career coach. Analyze this resume and provide a score out of 100 based on clarity, quantified achievements, relevant skills, and overall structure. Respond in exactly this format and nothing else:\n\nSCORE: [number]/100\nREASON: [one sentence explaining the score]\n\n\nResume:\n${inputText}`
                    }
                ]
            })
        });

        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error("Error in /api/score:", error);
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/submit-user', async (req, res) => {
    try {
        const { name, surname, email } = req.body;
        
        const { data, error } = await supabase
            .from("users")
            .insert({ name, surname, email });
             
        if (error) {
            throw error;
        }
        
        res.json({ success: true, data });
    } catch (error) {
        console.error("Error in /api/submit-user:", error);
        res.status(500).json({ error: error.message });
    }
});

if (process.env.NODE_ENV !== 'production') {
    app.listen(port, () => {
        console.log(`Server listening on port ${port}`);
    });
}

module.exports = app;
