import { useState, useRef } from "react";

export function useVoiceRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [answer, setAnswer] = useState("");
  const [isQuestion, setIsQuestion] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const startRecording = async () => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      mediaRecorderRef.current.start(250);
      setIsRecording(true);
    } catch (err) {
      setError("Não foi possível acessar o microfone");
      console.error("Erro ao acessar microfone:", err);
    }
  };

  const stopRecording = async () => {
    if (mediaRecorderRef.current?.state === "recording") {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      await processAudio();
    }
  };

  const processAudio = async () => {
    setIsLoading(true);
    setError(null);
    setAnswer("");
    setIsQuestion(false);

    try {
      const audioBlob = new Blob(audioChunksRef.current, {
        type: "audio/webm; codecs=opus",
      });

      if (audioBlob.size === 0) {
        throw new Error("Nenhum áudio foi gravado");
      }

      const response = await fetch("/api/voice-assistant", {
        method: "POST",
        body: audioBlob,
        headers: {
          "Content-Type": "audio/webm",
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Falha no processamento");
      }

      const data = await response.json();
      setTranscript(data.text);

      if (data.isQuestion && data.answer) {
        setIsQuestion(true);
        setAnswer(data.answer);
      }
    } catch (err) {
      console.error("Erro no processamento:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isRecording,
    transcript,
    isQuestion,
    answer,
    isLoading,
    error,
    startRecording,
    stopRecording,
  };
}
