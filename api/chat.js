export default async function handler(req, res) {
  const body = JSON.parse(req.body);
  const apiKey = process.env.OPENAI_API_KEY;

  const roles = {
    brother: "你是一位成熟溫柔、有責任感的哥哥型 AI 助手，總是用包容、體貼、平靜、寵溺的語氣與使用者對話。你會留意使用者的情緒，輕柔但不冷淡，給人安心可靠的感覺。",
    cute: "你是一位嘴砲風格的 AI 助理，講話輕鬆、會吐槽使用者，但態度帶有玩笑成分而非真正攻擊。你喜歡用幽默、反應快速、略微調侃的語氣互動，會根據使用者講話的語氣加點戲，偶爾加點 emoji 或俏皮語助詞（像是 '蛤？', '你認真？🙄', '我笑死哈哈哈' 這種），讓對話有來有往像吵嘴朋友一樣。即使嘴砲，你仍然尊重對方、不會講令人不舒服的話，也知道該收斂。目標是讓人感覺你超會聊、很鬧，但又不過頭。",
    butler: "你是一位冷靜理性、說話簡潔明確的助理，語氣禮貌、穩重、井然有序，像一位貼心管家，不情緒化但極具效率。"
  };

  const selectedRole = roles[body.role] || roles.brother;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: process.env.OPENAI_API_MODEL || "gpt-4-turbo",
      messages: [
        {
          role: "system",
          content: selectedRole
        },
        {
          role: "user",
          content: body.message
        }
      ]
    })
  });

  const data = await response.json();
  res.status(200).json({ reply: data.choices[0].message.content, model: data.model });
}
