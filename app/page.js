"use client";
import { useState, useRef } from "react";

export default function VoiceTranscriber() {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
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

    try {
      const audioBlob = new Blob(audioChunksRef.current, {
        type: "audio/webm; codecs=opus",
      });

      if (audioBlob.size === 0) {
        throw new Error("Nenhum áudio foi gravado");
      }

      const response = await fetch("/api/transcribe", {
        method: "POST",
        body: audioBlob,
        headers: {
          "Content-Type": "audio/webm",
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Falha na transcrição");
      }

      const { text } = await response.json();
      setTranscript(text);
    } catch (err) {
      console.error("Erro na transcrição:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-2xl font-semibold mb-8">
        Transcrição de Voz para Texto
      </h1>

      <button
        onClick={isRecording ? stopRecording : startRecording}
        disabled={isLoading}
        className={`px-5 border-2 text-[#363636] hover:bg-transparent hover:text-white py-[4px] rounded-lg font-medium duration-300 ${
          isRecording
            ? "bg-green-500 border-green-500"
            : "bg-white border-white"
        } ${isLoading ? "opacity-50" : ""}`}
      >
        {isLoading
          ? "Processando..."
          : isRecording
          ? "Parar Gravação"
          : "Iniciar Gravação"}
      </button>

      {error && (
        <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {transcript && (
        <div className="mt-6 bg-gray-100 p-4 rounded max-w-xl w-full text-[#363636]">
          <h2 className="text-[#363636] font-semibold mb-2">Transcrição:</h2>
          <p className="whitespace-pre-wrap text-[#363636]">{transcript}</p>
        </div>
      )}
    </div>
  );
}
