export default async function handler(req, res) {
  try {
    const body = JSON.parse(req.body);
    const apiKey = process.env.OPENAI_API_KEY;
    const model = process.env.OPENAI_API_MODEL?.trim() || "gpt-4-turbo"; // 預設使用 Turbo

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: "system",
            content: "你是一個基於 OpenAI GPT-4 模型（實際上可能是 GPT-4 Turbo）的 AI 助手。請如實回答問題。如果你不確定答案，可以推測，但務必說明這是推測。請誠實，不要假裝知道答案。"
          },
          { role: "user", content: body.message }
        ]
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("OpenAI API error:", data);
      return res.status(response.status).json({ error: data.error?.message || "OpenAI API error" });
    }

    res.status(200).json({ reply: data.choices[0].message.content });

  } catch (err) {
    console.error("API error:", err);
    res.status(500).json({ error: "Server error" });
  }
}
