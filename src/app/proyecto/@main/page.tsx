// src\app\proyecto\@main\page.tsx

"use client";

import React from "react";
import ProjectForm from "../../components/ProjectForm";
import { useProyecto } from "../ProyectoContext";
import { useAuth } from "@/context/AuthContext";

export default function ProyectoMain() {
  const {
    projects,
    liners,
    machines,

    loading,
    error,
    showForm,
    editingProject,
    isSubmitting,
    handleFormSubmit,
    handleEditClick,
    handleDeleteProject,
    handleDeleteLiner,
    handleDeleteMachine,
    handleEditLiner,
    handleEditMachine,
    handleCancelForm,
    setEditingProject,
    setShowForm,
    selectedProject,
    setSelectedProject,
    selectedLiner,
    setSelectedLiner,
    selectedMachine,
    setSelectedMachine,
  } = useProyecto();

  const { isLogged } = useAuth()

  if (!isLogged) {
    return (
      <div className="flex-1 overflow-y-auto col-[1/13] lg:grid lg:grid-rows-[repeat(17,1fr)] h-full">
        <div className="row-[1/18] lg:col-[1/13] p-4">
          {/* Sección de Proyectos */}
          <section className="mb-8">
            <section className="my-6 mx-[10vw]">
              <h1 className="text-2xl font-bold text-blue-950 mb-8">
                Gestión de Proyectos
              </h1>
              <p className=" text-blue-950">
                Inicie sesión para poder visualizar todos los
                proyectos del usuario, liners y maquinas creados,
                asi como tambien crear capas y generar el código
                G-Code de sus proyectos.
              </p>
            </section>
          </section>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto col-[1/13] lg:grid lg:grid-rows-[repeat(17,1fr)] h-full">
      <div className="row-[1/18] lg:col-[1/13] p-4">
        {/* Sección de Proyectos */}
        <section className="mb-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-blue-950">
              Gestión de Proyectos
            </h1>
            <p className="text-sm text-gray-500">
              Aquí se encuentran todos los proyectos del usuario.
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="bg-white-50 rounded-lg shadow overflow-hidden border border-blue-200">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-blue-50">
                  <tr>
                    {/*<th className="px-6 py-3 text-left text-xs font-medium text-blue-900 uppercase tracking-wider w-16">
                      Selección
                    </th>*/}
                    <th className="px-6 py-3 text-left text-xs font-medium text-blue-900 uppercase tracking-wider">
                      Proyecto
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-blue-900 uppercase tracking-wider">
                      Porcentaje completado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-blue-900 uppercase tracking-wider">
                      Última Modificación
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-blue-900 uppercase tracking-wider w-32">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white-50 divide-y divide-gray-200">
                  {projects.length === 0 ? (
                      <tr className="bg-white-50">
                      <td
                        colSpan={4}
                        className="px-6 py-4"
                      >
                        <div className="text-center py-8 text-gray-500">
                          No hay proyectos
                          registrados. ¡Crea tu primer
                          proyecto!
                        </div>
                      </td>
                    </tr>
                  ) : (
                    projects.map((project) => (
                      <tr
                        key={project.id}
                        className={`bg-white-50 hover:bg-gray-50 cursor-pointer ${selectedProject?.id ===
                          project.id
                          ? "bg-blue-50"
                          : ""
                          }`}
                        onClick={() =>
                          setSelectedProject(project)
                        }
                      >
                        {/*<td className="px-6 py-4 whitespace-nowrap text-center">
                          <input
                            type="radio"
                            name="proyecto-seleccionado"
                            checked={
                              selectedProject?.id ===
                              project.id
                            }
                            onChange={() =>
                              setSelectedProject(
                                project,
                              )
                            }
                            className="h-5 w-5 accent-blue-600 cursor-pointer"
                          />
                        </td>*/}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div
                            className={`font-medium ${selectedProject?.id ===
                              project.id
                              ? "font-bold text-blue-800"
                              : "text-gray-900"
                              }`}
                          >
                            {project.name}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {/* Barra de progreso visual */}
                            <div className="w-full bg-gray-200 rounded-full h-2.5 mr-3">
                              <div
                                className="bg-blue-600 h-2.5 rounded-full"
                                style={{ width: `${project.completion_percentage}%` }}
                              ></div>
                            </div>

                            {/* Porcentaje numérico */}
                            <div className={`min-w-[40px] text-right ${selectedProject?.id === project.id
                              ? "font-bold text-blue-800"
                              : "text-gray-900"
                              }`}>
                              {project.completion_percentage}%
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                          {new Date(
                            project.created_at,
                          ).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                          <div className="flex justify-center gap-3">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditClick(project);
                              }}
                              className="text-blue-600 hover:text-blue-900 bg-blue-50 p-1.5 rounded-md transition-colors"
                              title="Editar Proyecto"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteProject(project.id);
                              }}
                              className="text-red-600 hover:text-red-900 bg-red-50 p-1.5 rounded-md transition-colors"
                              title="Eliminar Proyecto"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Sección de Liners */}
        <section className="mb-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-blue-950">
              Liners (Mandriles)
            </h1>
            <p className="text-sm text-gray-500">
              Aquí se encuentran todos los liners del usuario.
            </p>
          </div>

          <div className="bg-white-50 rounded-lg shadow overflow-hidden border border-blue-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-blue-50">
                <tr>
                  {/*<th className="px-6 py-3 text-left text-xs font-medium text-blue-900 uppercase tracking-wider w-16">
                    Selección
                  </th>*/}
                  <th className="px-6 py-3 text-left text-xs font-medium text-blue-900 uppercase tracking-wider">
                    Nombre del Liner
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-blue-900 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-blue-900 uppercase tracking-wider">
                    Creado
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-blue-900 uppercase tracking-wider w-32">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {!liners || liners.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-4">
                      <div className="text-center py-8 text-gray-500">
                        No hay liners registrados. ¡Crea
                        tu primer liner!
                      </div>
                    </td>
                  </tr>
                ) : (
                  liners.map((liner) => (
                    <tr
                      key={liner.id}
                      className={`hover:bg-gray-50 cursor-pointer ${selectedLiner?.id === liner.id
                        ? "bg-blue-50"
                        : ""
                        }`}
                      onClick={() =>
                        setSelectedLiner?.(liner)
                      }
                    >
                      {/*<td className="px-6 py-4 whitespace-nowrap text-center">
                        <input
                          type="radio"
                          name="liner-seleccionado"
                          checked={
                            selectedLiner?.id ===
                            liner.id
                          }
                          onChange={() =>
                            setSelectedLiner?.(
                              liner,
                            )
                          }
                          className="h-5 w-5 accent-blue-600 cursor-pointer"
                        />
                      </td>*/}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div
                          className={`font-medium ${selectedLiner?.id ===
                            liner.id
                            ? "font-bold text-blue-800"
                            : "text-gray-900"
                            }`}
                        >
                          {liner.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${liner.tipo_liner ===
                            "simple"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-gray-100 text-gray-800"
                            }`}
                        >
                          {liner.tipo_liner
                            ?.charAt(0)
                            .toUpperCase() +
                            liner.tipo_liner?.slice(
                              1,
                            ) || "Simple"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                        {liner.created_at
                          ? new Date(
                            liner.created_at,
                          ).toLocaleDateString()
                          : "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                        <div className="flex justify-center gap-3">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditLiner(liner);
                            }}
                            className="text-blue-600 hover:text-blue-900 bg-blue-50 p-1.5 rounded-md transition-colors"
                            title="Editar Liner"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteLiner(liner.id);
                            }}
                            className="text-red-600 hover:text-red-900 bg-red-50 p-1.5 rounded-md transition-colors"
                            title="Eliminar Liner"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Sección de Máquinas */}
        <section className="mb-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-blue-950">
              Máquinas
            </h1>
            <p className="text-sm text-gray-500">
              Aquí se encuentran todas las máquinas del usuario.
            </p>
          </div>

          <div className="bg-white-50 rounded-lg shadow overflow-hidden border border-blue-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-blue-50">
                <tr>
                  {/*<th className="px-6 py-3 text-left text-xs font-medium text-blue-900 uppercase tracking-wider w-16">
                    Selección
                  </th>*/}
                  <th className="px-6 py-3 text-left text-xs font-medium text-blue-900 uppercase tracking-wider">
                    Nombre de la Máquina
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-blue-900 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-blue-900 uppercase tracking-wider">
                    Velocidad
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-blue-900 uppercase tracking-wider">
                    Creado
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-blue-900 uppercase tracking-wider w-32">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {!machines || machines.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-4">
                      <div className="text-center py-8 text-gray-500">
                        No hay máquinas registradas.
                        ¡Crea tu primera máquina!
                      </div>
                    </td>
                  </tr>
                ) : (
                  machines.map((machine) => (
                    <tr
                      key={machine.id}
                      className={`hover:bg-gray-50 cursor-pointer ${selectedMachine?.id ===
                        machine.id
                        ? "bg-blue-50"
                        : ""
                        }`}
                      onClick={() =>
                        setSelectedMachine?.(machine)
                      }
                    >
                      {/*<td className="px-6 py-4 whitespace-nowrap text-center">
                        <input
                          type="radio"
                          name="maquina-seleccionada"
                          checked={
                            selectedMachine?.id ===
                            machine.id
                          }
                          onChange={() =>
                            setSelectedMachine?.(
                              machine,
                            )
                          }
                          className="h-5 w-5 accent-blue-600 cursor-pointer"
                        />
                      </td>*/}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div
                          className={`font-medium ${selectedMachine?.id ===
                            machine.id
                            ? "font-bold text-blue-800"
                            : "text-gray-900"
                            }`}
                        >
                          {machine.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${machine.tipo === "CNC"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-gray-100 text-gray-800"
                            }`}
                        >
                          {machine.tipo || "CNC"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                        {machine.velocidad_maquina || 0}{" "}
                        mm/min
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                        {machine.created_at
                          ? new Date(
                            machine.created_at,
                          ).toLocaleDateString()
                          : "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                        <div className="flex justify-center gap-3">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditMachine(machine);
                            }}
                            className="text-blue-600 hover:text-blue-900 bg-blue-50 p-1.5 rounded-md transition-colors"
                            title="Editar Máquina"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteMachine(machine.id);
                            }}
                            className="text-red-600 hover:text-red-900 bg-red-50 p-1.5 rounded-md transition-colors"
                            title="Eliminar Máquina"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="h-[1vh]"></section>
      </div>
    </div>
  );
}
