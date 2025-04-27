"use client";
import Button from "@/components/Button";
import { useVoiceRecorder } from "@/hooks/useVoiceRecorder";

export default function VoiceTranscriber() {
  const {
    isRecording,
    transcript,
    isQuestion,
    answer,
    isLoading,
    error,
    startRecording,
    stopRecording,
  } = useVoiceRecorder();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-2xl font-semibold mb-8">Assistente de Voz</h1>

      <Button
        isRecording={isRecording}
        isLoading={isLoading}
        stopRecording={stopRecording}
        startRecording={startRecording}
      />

      {error && (
        <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {transcript && (
        <div className="mt-6 bg-gray-100 p-4 rounded max-w-xl w-full text-[#363636]">
          <h2 className="text-[#363636] font-semibold mb-2">Sua fala:</h2>
          <p className="whitespace-pre-wrap text-[#363636]">{transcript}</p>
        </div>
      )}

      {isQuestion && answer && (
        <div className="mt-4 bg-blue-50 p-4 rounded max-w-xl w-full text-[#363636] border-l-4 border-blue-500">
          <h2 className="text-[#363636] font-semibold mb-2">Resposta:</h2>
          <p className="whitespace-pre-wrap text-[#363636]">{answer}</p>
        </div>
      )}
    </div>
  );
}
