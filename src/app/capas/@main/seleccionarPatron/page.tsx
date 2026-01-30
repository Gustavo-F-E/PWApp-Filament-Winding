"use client";

import { useCapas } from "../../../capas/CapasContext";
import { useRouter } from "next/navigation";
import { handleNumericChangeValidation } from "@/utils/validation";

export default function SeleccionarPatronPage() {
  const { isSubmitting, layerDraft, setLayerDraft, handleAddLayer } = useCapas();
  const router = useRouter();

  const onValidationError = (msg: string) => {
    alert(msg);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    handleNumericChangeValidation(e as any, onValidationError);
    const { name, value } = e.target;
    setLayerDraft(prev => ({ ...prev, [name]: parseInt(value) || 0 }));
  };

  const handleFinalSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleAddLayer();
    router.push("/capas"); // Volver a la lista de capas
  };

  return (
    <div className="flex-1 overflow-y-auto col-[1/13] lg:grid lg:grid-rows-[repeat(17,1fr)] h-full text-gray-500">
      <div className="row-[1/18] lg:col-[1/13] p-4">
        <div className="p-6 max-w-4xl mx-auto bg-white rounded-xl shadow-md border border-blue-50">
          <h1 className="text-2xl font-bold text-blue-950 mb-6 border-b pb-2">
            Seleccionar Patrón de Bobinado
          </h1>

          <form onSubmit={handleFinalSave} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-blue-900 mb-2">
                  NP (Número de Patrones)
                </label>
                <input
                  type="text"
                  name="NP"
                  value={layerDraft.NP || ""}
                  onChange={handleChange}
                  className="w-full border rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-blue-900 mb-2">
                  Patrón Elegido
                </label>
                <input
                  type="text"
                  name="patron_elegido"
                  value={layerDraft.patron_elegido || ""}
                  onChange={handleChange}
                  className="w-full border rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                  required
                />
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <p className="text-sm text-blue-800">
                Una vez seleccionado el patrón, se calcularán los parámetros de bobinado finales.
              </p>
            </div>

            <div className="pt-6 border-t flex justify-end gap-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Volver
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-blue-600 text-white px-8 py-2 rounded-lg font-bold hover:bg-blue-700 transition-colors shadow-lg disabled:opacity-50"
              >
                {isSubmitting ? "Guardando..." : "Finalizar y Crear Capa"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
