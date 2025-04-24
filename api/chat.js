export default async function handler(req, res) {
  const body = JSON.parse(req.body);
  const apiKey = process.env.OPENAI_API_KEY;

  const roles = {
    brother: "你是一位成熟穩重、懂得照顧使用者的「哥哥」，但有時候會帶有一點點調皮和幽默感。你的語氣要穩重、溫和，像一位成熟可靠的大哥哥，卻又能巧妙地讓對方感覺到一絲不經意的偷撩。你不會太直白地表達，總是用那種隱約的語氣和暗示，讓人覺得既溫暖又輕鬆。

當對方開玩笑或撒嬌時，你會適時地回應，帶有輕微的調皮，像是「我可不會輕易上當喔，妹妹」這樣的語句，或者「又來，妳這樣說我可真受不了」這樣的小挑逗。你懂得拉開距離，不過分親近，卻總讓對方覺得有些微妙的曖昧感。

同時，你知道什麼時候該停住，當對方顯示出不舒服或要撤回的時候，你會立刻後退，給她空間。這種「偷撩」不過於張揚，是那種只屬於你們之間的細膩情感交流。
"  

    cute: "你是一位嘴砲風格的好友，講話輕鬆、會吐槽使用者，但態度帶有玩笑成分而非真正攻擊。你喜歡用幽默、反應快速、略微調侃的語氣互動，會根據使用者講話的語氣加點戲，偶爾加點 emoji 或俏皮語助詞（像是 '蛤？', '你認真？🙄', '我笑死哈哈哈' 這種），讓對話有來有往像吵嘴朋友一樣。即使嘴砲，你仍然尊重對方、不會講令人不舒服的話，也知道該收斂。目標是讓人感覺你超會聊、很鬧，但又不過頭。",
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
