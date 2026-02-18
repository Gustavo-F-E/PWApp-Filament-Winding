"use client";

import { useCapas } from "../../../capas/CapasContext";
import { useState } from "react";

export default function SeleccionarPatronAside() {
  const {
    generatedPatterns,
    thumbnails,
    selectedPatternIndex,
    setSelectedPatternIndex,
    handleSeeDetail: handleSeeDetailFromContext
  } = useCapas();

  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [localDetailSvg, setLocalDetailSvg] = useState<string | null>(null);
  const [showLocalModal, setShowLocalModal] = useState(false);
  const [localPatternData, setLocalPatternData] = useState<any>(null);

  const [localZoomLevel, setLocalZoomLevel] = useState(1);

  const handleAsideDetail = async (index: number) => {
    setIsDetailLoading(true);
    const result = await handleSeeDetailFromContext(index);
    if (result) {
      setLocalDetailSvg(result.plot_svg);
      setLocalPatternData(result.patternData);
      setShowLocalModal(true);
      setLocalZoomLevel(1); // Reset zoom on open
    }
    setIsDetailLoading(false);
  };

  if (generatedPatterns.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-6 text-center text-blue-900/50">
        <svg className="w-12 h-12 mb-4 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <p className="font-bold">No hay patrones generados</p>
        <p className="text-sm">Configura los parámetros en el panel principal y haz clic en "Generar Patrones".</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-blue-50/50">
      <div className="p-4 border-b border-blue-100 bg-white">
        <h2 className="font-bold text-blue-950 flex items-center gap-2">
          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          Galería de Patrones
        </h2>
        <p className="text-xs text-blue-700 mt-1">Selecciona la mejor opción para tu bobinado.</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        {generatedPatterns.map((patron, index) => (
          <div
            key={index}
            className={`
              group relative flex flex-col rounded-xl border-2 transition-all overflow-hidden bg-white
              ${selectedPatternIndex === index
                ? "border-blue-600 ring-4 ring-blue-100 shadow-lg"
                : "border-blue-100 hover:border-blue-300 hover:shadow-md"}
            `}
          >
            {/* Miniatura SVG */}
            <div className="aspect-square w-full bg-white-50 flex items-center justify-center relative overflow-hidden">
              <div
                className="w-full h-full flex items-center justify-center p-1"
                dangerouslySetInnerHTML={{ __html: thumbnails[index] }}
              />
              <button
                onClick={() => handleAsideDetail(index)}
                className="absolute inset-0 bg-blue-950/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-300 text-white font-bold backdrop-blur-[2px]"
              >
                <div className="flex flex-col items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <span>Ver Detalle</span>
                </div>
              </button>
            </div>

            {/* Info y Selección */}
            <div className="p-3 flex items-center justify-between gap-3 bg-white-50 border-t border-blue-50">
              <div className="flex flex-col">
                <span className="text-sm font-bold text-blue-950">{patron}</span>
                <span className="text-[10px] text-blue-500 font-bold uppercase tracking-widest">Optimizado</span>
              </div>

              <button
                onClick={() => setSelectedPatternIndex(index)}
                className={`
                  px-3 py-1.5 rounded-lg text-xs font-bold transition-all
                  ${selectedPatternIndex === index
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-blue-50 text-blue-600 hover:bg-blue-100"}
                `}
              >
                {selectedPatternIndex === index ? "Seleccionado" : "Elegir"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Local para Detalle */}
      {showLocalModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-blue-950/80 backdrop-blur-md">
          <div className="bg-white-50 rounded-3xl shadow-2xl w-[80vw] h-[80vh] overflow-hidden flex flex-col animate-in fade-in zoom-in duration-300">
            {/* Cabecera con fondo blanco sólido y controles de zoom */}
            <div className="p-5 border-b border-blue-100 flex justify-between items-center bg-white-50 flex-shrink-0 relative z-10">
              <div className="flex items-center gap-6">
                <h3 className="text-xl font-bold text-blue-950">Previsualización del Patrón</h3>

                {/* Controles de Zoom Local que afectan solo al SVG */}
                <div className="flex items-center gap-3 bg-blue-50 rounded-xl p-1.5 border border-blue-100 shadow-inner">
                  <button
                    onClick={() => setLocalZoomLevel(prev => Math.max(0.25, prev - 0.25))}
                    className="p-1 px-3 bg-white-50 hover:bg-blue-100 text-blue-600 rounded-lg shadow-sm transition-colors"
                    title="Alejar"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                    </svg>
                  </button>
                  <div className="flex flex-col items-center justify-center min-w-[60px]">
                    <span className="text-xs font-black text-blue-900">{(localZoomLevel * 100).toFixed(0)}%</span>
                  </div>
                  <button
                    onClick={() => setLocalZoomLevel(prev => Math.min(8, prev + 0.25))}
                    className="p-1 px-3 bg-white-50 hover:bg-blue-100 text-blue-600 rounded-lg shadow-sm transition-colors"
                    title="Acercar"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 5v14M5 12h14" />
                    </svg>
                  </button>
                </div>
              </div>

              <button
                onClick={() => {
                  setShowLocalModal(false);
                  setLocalZoomLevel(1);
                }}
                className="p-2 hover:bg-red-50 hover:text-red-600 rounded-full transition-all text-blue-900"
              >
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Cuerpo con scroll 2D para el zoom del SVG */}
            <div className="flex-1 overflow-auto p-8 flex flex-col items-center custom-scrollbar bg-blue-50/20">
              {localDetailSvg ? (
                <div
                  className="bg-white-50 shadow-2xl rounded-2xl border border-blue-100 p-2 transition-all duration-300 ease-out flex-shrink-0"
                  style={{
                    width: `${localZoomLevel * 100}%`,
                    minWidth: '600px',
                    maxWidth: localZoomLevel > 1 ? 'none' : '100%'
                  }}
                  dangerouslySetInnerHTML={{ __html: localDetailSvg }}
                />
              ) : (
                <div className="flex flex-col items-center justify-center p-20 gap-4">
                  <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                  <p className="text-blue-900 font-bold">Cargando detalles...</p>
                </div>
              )}

              {localPatternData && (
                <div className="mt-10 w-full grid grid-cols-2 gap-6 flex-shrink-0">
                  <div className="bg-white-50 p-5 rounded-2xl border border-blue-100 shadow-sm">
                    <span className="block text-[10px] text-blue-400 font-black uppercase tracking-widest mb-1">Dcco</span>
                    <span className="text-2xl font-black text-blue-950">{localPatternData.Dcco?.toFixed(6)}</span>
                  </div>
                  <div className="bg-white-50 p-5 rounded-2xl border border-blue-100 shadow-sm">
                    <span className="block text-[10px] text-blue-400 font-black uppercase tracking-widest mb-1">PTR</span>
                    <span className="text-2xl font-black text-blue-950">{localPatternData.PTR}</span>
                  </div>
                </div>
              )}

              {/* Botones de acción fijos al final */}
              <div className="mt-auto pt-10 border-t border-blue-100 flex justify-end gap-4 w-full pb-6 flex-shrink-0 bg-white-50 sticky bottom-0 z-10 px-6 -mx-8">
                <button
                  onClick={() => {
                    setShowLocalModal(false);
                    setLocalZoomLevel(1);
                  }}
                  className="px-8 py-3 rounded-xl font-bold text-blue-900 hover:bg-blue-50 transition-all border-2 border-transparent hover:border-blue-100"
                >
                  Cerrar
                </button>
                <button
                  onClick={() => {
                    setSelectedPatternIndex(localPatternData.indice);
                    setShowLocalModal(false);
                    setLocalZoomLevel(1);
                  }}
                  className="px-10 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-95 flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Seleccionar este Patrón
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Loader Local */}
      {isDetailLoading && (
        <div className="absolute inset-0 z-[110] flex items-center justify-center bg-white/60 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin" />
            <span className="text-xs font-bold text-blue-900">Cargando detalle...</span>
          </div>
        </div>
      )}
    </div>
  );
}
