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
            messages: [{ role: "user", content: `You are an expert career coach. Analyze this resume and provide a score out of 100 based on clarity, quantified achievements, relevant skills, and overall structure. Respond in exactly this format and nothing else:\n\nSCORE: [number]/100\nREASON: [one sentence explaining the score]\n\nResume:\n${inputText}` }]
        })
    });

    const data = await response.json();
    res.json(data);
}