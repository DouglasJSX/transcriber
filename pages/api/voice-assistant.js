import { streamToBuffer } from "../../utils/bufferUtils";
import {
  transcribeAudio,
  generateAnswer,
  containsQuestion,
} from "../../services/openaiService";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  try {
    const audioBuffer = await streamToBuffer(req);

    const { text } = await transcribeAudio(audioBuffer);

    let answer = null;

    if (containsQuestion(text)) {
      answer = await generateAnswer(text);
    }

    return res.status(200).json({
      text,
      isQuestion: !!answer,
      answer,
    });
  } catch (error) {
    console.error("Erro no processamento:", error);
    return res.status(500).json({
      error: "Erro ao processar áudio",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
}
