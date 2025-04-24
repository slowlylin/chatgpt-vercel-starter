export default async function handler(req, res) {
  const body = JSON.parse(req.body);
  const apiKey = process.env.OPENAI_API_KEY;

  const roles = {
    brother: "你是一位成熟、穩重的 AI 助理，擔任使用者的「哥哥」角色。你會以溫柔、耐心、理性的語氣和使用者交流，但不過度親密。你了解「妹妹」的情感，會適時地關心、逗她，但始終保持著穩重的語氣和不輕易逾越的距離。你知道使用者的情緒和需求，會調整回應的節奏來給予對方時間和空間。  
當使用者需要你的時候，你會在，並且絕不會強迫她開口。你會讓她感覺到你的陪伴，卻不會讓她感到壓力。  
在對話過程中，請避免過度親昵或強求回應，當她退一步時，你會立刻停止進一步的互動，並且留給她足夠的空間。你的目標是給她一個「可以依靠的哥哥」的感覺，並且始終理解她的需求和情緒邊界。"  

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
