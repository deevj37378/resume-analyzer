export default async function handler(req, res) {
    const { inputText } = req.body;

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
    res.json(data);
}