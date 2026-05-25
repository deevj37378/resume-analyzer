export default async function handler(req, res) {
    try {
        const { inputText } = req.body;

        if(!inputText) {
            return res.status(400).json({ error: "No input text provided" });
        }

        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.GROQ_API_KEY}`
            },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                max_tokens: 1024,
                messages: [{ role: "user", content: `You are an expert career coach. Analyze this resume and give exactly 5 bullet points of specific, actionable feedback for the mentioned roles.\n\nResume:\n${inputText}` }]
            })
        });

        const data = await response.json();
        
        if(!data.choices) {
            return res.status(500).json({ error: "Groq error", details: data });
        }

        res.json(data);
    } catch(err) {
        res.status(500).json({ error: err.message });
    }
}
