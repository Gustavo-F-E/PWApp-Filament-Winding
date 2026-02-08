"use client";

import React, { useState } from "react";
import { useProyecto } from "../../ProyectoContext";

export default function GCodePage() {
  const { projects } = useProyecto();
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  // Ordenar proyectos de más nuevo a más antiguo por fecha de modificación
  const sortedProjects = [...projects].sort((a, b) =>
    new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
  );

  const selectedProject = projects.find(p => p.id === selectedProjectId);
  const isReady = selectedProject?.completion_percentage === 100;

  return (
    <div className="flex-1 overflow-y-auto col-[1/13] lg:grid lg:grid-rows-[repeat(17,1fr)] h-full">
      <div className="row-[1/18] lg:col-[1/13] p-4">
        <div className="p-6 max-w-5xl mx-auto bg-white-50 rounded-xl shadow-md border border-blue-50">
          <h1 className="text-2xl font-bold text-blue-950 mb-6 border-b pb-2">
            Generación de G-Code
          </h1>

          <p className="text-white-600 mb-8">
            Selecciona un proyecto finalizado para generar su código
            de manufactura.
            <span className="block mt-1 text-sm text-blue-600 font-semibold">
              * El botón se activará solo cuando el proyecto alcance
              el 100% de definición.
            </span>
          </p>

          <div className="overflow-hidden border border-white-200 rounded-lg mb-8">
            <table className="min-w-full divide-y divide-white-200">
              <thead className="bg-white-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-white-500 uppercase tracking-wider">
                    Sel.
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-white-500 uppercase tracking-wider">
                    Proyecto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-white-500 uppercase tracking-wider">
                    Modificación
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-white-500 uppercase tracking-wider">
                    Progreso
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-white-200">
                {sortedProjects.map((project) => (
                  <tr
                    key={project.id}
                    className={`hover:bg-blue-50 cursor-pointer transition-colors ${selectedProjectId === project.id ? "bg-blue-100" : ""}`}
                    onClick={() =>
                      setSelectedProjectId(project.id)
                    }
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="radio"
                        name="gcode-project"
                        checked={
                          selectedProjectId ===
                          project.id
                        }
                        onChange={() =>
                          setSelectedProjectId(
                            project.id,
                          )
                        }
                        className="accent-blue-600"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-white-900">
                        {project.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white-500">
                      {new Date(
                        project.updated_at,
                      ).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-24 h-2 bg-white-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all ${project.completion_percentage === 100 ? "bg-blue-500" : "bg-blue-400"}`}
                            style={{
                              width: `${project.completion_percentage}%`,
                            }}
                          />
                        </div>
                        <span
                          className={`text-xs font-bold ${project.completion_percentage === 100 ? "text-blue-600" : "text-white-500"}`}
                        >
                          {
                            project.completion_percentage
                          }
                          %
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-center pt-4">
            <button
              disabled={!isReady}
              className={`w-[60%] lg:w-[30%] px-12 py-4 rounded-full font-bold text-lg   shadow-lg transition-all transform hover:scale-105 active:scale-95 ${isReady
                ? "bg-blue-950 text-blue-50 cursor-pointer hover:bg-blue-700"
                : "bg-blue-50 text-blue-300 border border-blue-300 cursor-not-allowed"
                }`}
              onClick={() =>
                alert(
                  "Generando G-Code para: " +
                  selectedProject?.name,
                )
              }
            >
              GENERAR G-Code
            </button>
          </div>
          <div className="flex justify-center pt-4">
            <button
              disabled={!isReady}
              className={`w-[60%] lg:w-[30%] px-12 py-4 rounded-full font-bold text-lg shadow-lg transition-all transform hover:scale-105 active:scale-95 ${isReady
                ? "bg-blue-950 text-blue-50 cursor-pointer hover:bg-blue-700"
                : "bg-blue-50 text-blue-300 border border-blue-300 cursor-not-allowed"
                }`}
              onClick={() =>
                alert(
                  "Generando G-Code para: " +
                  selectedProject?.name,
                )
              }
            >
              Guardar G-Code
            </button>
          </div>
          <div className="flex justify-center pt-4">
            <button
              disabled={!isReady}
              className={`w-[60%] lg:w-[30%] px-12 py-4 rounded-full font-bold text-lg shadow-lg transition-all transform hover:scale-105 active:scale-95 ${isReady
                ? "bg-blue-950 text-blue-50 cursor-pointer hover:bg-blue-700"
                : "bg-blue-50 text-blue-300 border border-blue-300 cursor-not-allowed"
                }`}
              onClick={() =>
                alert(
                  "Generando G-Code para: " +
                  selectedProject?.name,
                )
              }
            >
              Enviar G-Code
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
