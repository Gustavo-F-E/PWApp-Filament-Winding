// src\app\proyecto\@aside\GCode\page.tsx

"use client";

import React, { useState, useEffect } from "react";
import { useProyecto } from "../../ProyectoContext";
import { motion } from "framer-motion";
import { FiFileText, FiChevronDown, FiCopy, FiCheck } from "react-icons/fi";

export default function GCodeAside() {
  const { gcodeData, isCalculatingGCode } = useProyecto();
  const [selectedFileName, setSelectedFileName] = useState<string>("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (gcodeData) {
      const keys = Object.keys(gcodeData);
      if (keys.length > 0 && (!selectedFileName || !gcodeData[selectedFileName])) {
        setSelectedFileName("Total" in gcodeData ? "Total" : keys[0]);
      }
    } else {
      setSelectedFileName("");
    }
  }, [gcodeData, selectedFileName]);

  const handleCopy = () => {
    if (!gcodeData || !selectedFileName) return;
    const text = gcodeData[selectedFileName].join("\n");
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isCalculatingGCode) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center space-y-6 bg-blue-100/30">
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 90, 180, 270, 360]
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="w-16 h-16 bg-blue-600 rounded-3xl shadow-xl flex items-center justify-center"
        >
          <FiFileText className="text-white text-3xl" />
        </motion.div>
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-blue-900">Generando</h3>
          <p className="text-xs text-blue-600 font-medium">Procesando trayectorias...</p>
        </div>
      </div>
    );
  }

  const fileKeys = gcodeData ? Object.keys(gcodeData) : [];
  const currentLines = (gcodeData && selectedFileName) ? gcodeData[selectedFileName] : [];

  return (
    <div className="h-full flex flex-col bg-blue-100/30">
      {/* File Selector */}
      <div className="p-4 border-b border-blue-200">
        <div className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-2">Previsualización</div>
        <div className="relative">
          <select
            className={`w-full ${gcodeData ? 'bg-blue-600' : 'bg-blue-200'} border-none rounded-xl px-4 py-2 text-white text-xs font-bold appearance-none cursor-pointer transition-all`}
            value={selectedFileName}
            onChange={(e) => setSelectedFileName(e.target.value)}
            disabled={!gcodeData}
            suppressHydrationWarning
          >
            {!gcodeData && <option>Esperando datos...</option>}
            {fileKeys.map(key => (
              <option key={key} value={key} className="text-blue-900 bg-white font-semibold">{key}</option>
            ))}
          </select>
          <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70 pointer-events-none" />
        </div>
      </div>

      {/* Code Area */}
      <div className="flex-1 min-h-0 relative">
        {gcodeData ? (
          <>
            <pre className="h-full p-4 text-[10px] font-mono text-blue-950/70 bg-white/20 overflow-y-auto scrollbar-thin scrollbar-thumb-blue-200">
              {currentLines.join("\n")}
            </pre>
            <button
              onClick={handleCopy}
              className="absolute top-2 right-2 p-2 bg-white shadow-md rounded-lg text-blue-600 hover:bg-blue-600 hover:text-white transition-all transform active:scale-90"
            >
              {copied ? <FiCheck className="text-green-500" /> : <FiCopy />}
            </button>
          </>
        ) : (
          <div className="h-full flex flex-col items-center justify-center p-6 text-center opacity-30">
            <FiFileText className="text-4xl mb-2" />
            <p className="text-[10px] font-bold uppercase tracking-widest">Vista previa de código</p>
          </div>
        )}
      </div>
    </div>
  );
}
