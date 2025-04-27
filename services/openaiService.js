export async function transcribeAudio(audioBuffer) {
  const audioBlob = new Blob([audioBuffer], { type: "audio/webm" });

  const formData = new FormData();
  formData.append("file", audioBlob, "audio.webm");
  formData.append("model", "whisper-1");

  const response = await fetch(
    "https://api.openai.com/v1/audio/transcriptions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: formData,
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || "Falha na transcrição");
  }

  return response.json();
}

export async function generateAnswer(question) {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "Você é um assistente útil e conciso.",
        },
        {
          role: "user",
          content: question,
        },
      ],
      max_tokens: 500,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || "Falha ao gerar resposta");
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

export function containsQuestion(text) {
  const questionMarks = text.includes("?");
  const questionWords = [
    "quem",
    "qual",
    "quais",
    "quando",
    "onde",
    "como",
    "por que",
    "porque",
    "para que",
    "o que",
    "quê",
  ];

  const hasQuestionWord = questionWords.some((word) =>
    text.toLowerCase().includes(word)
  );

  return questionMarks || hasQuestionWord;
}
