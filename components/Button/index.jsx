import React from "react";

export default function Button({
  isRecording,
  startRecording,
  stopRecording,
  isLoading,
}) {
  return (
    <button
      onClick={isRecording ? stopRecording : startRecording}
      disabled={isLoading}
      className={`px-5 border-2 text-[#363636] hover:bg-transparent hover:text-white py-[4px] rounded-lg font-medium duration-300 ${
        isRecording ? "bg-green-500 border-green-500" : "bg-white border-white"
      } ${isLoading ? "opacity-50" : ""}`}
    >
      {isLoading
        ? "Processando..."
        : isRecording
        ? "Parar Gravação"
        : "Iniciar Gravação"}
    </button>
  );
}
