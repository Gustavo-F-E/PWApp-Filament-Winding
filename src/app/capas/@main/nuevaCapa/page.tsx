// src/app/capas/@main/nuevaCapa/page.tsx

"use client";

import React from "react";
import { useProyecto } from "../../CapasContext";
import { useRouter } from "next/navigation";

export default function nuevaCapaPage() {
  const { isSubmitting, handleFormSubmit } = useCapa();
  const router = useRouter();

  const onSubmit = (formData: { name: string; description: string }) => {
    handleFormSubmit(formData);
    // La lógica de redirección ya está en handleFormSubmit o debería estarlo.
    // Pero handleFormSubmit actualmente solo hace el fetch y un alert.
  };

  const onCancel = () => {
    router.back();
  };

  return (
    <div className="flex-1 overflow-y-auto col-[1/13] lg:grid lg:grid-rows-[repeat(17,1fr)] h-full">
      <div className="row-[1/18] lg:col-[1/13] p-4">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-blue-950 mb-4">
            Crear Nueva Capa
          </h1>
          <form
            onSubmit={handleSubmit}
            className="space-y-6 p-6 bg-white rounded-lg shadow-lg border border-blue-100"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-blue-900">
                {project ? "Configurar Capa" : "Nueva Capa"}
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre de la Capa
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 text-gray-700 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Nombre identificativo"
                  disabled={isSubmitting}
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descripción
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={2}
                  className="w-full px-3 py-2 text-gray-700 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Descripción breve (Añade 10% de definición)"
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Seleccionar Proyecto
                </label>
                <select
                  name="machine_name"
                  value={formData.machine_name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-gray-700 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                  disabled={isSubmitting}
                >
                  <option value="">-- Sin Proyecto --</option>
                  {machines.map((m) => (
                    <option key={m.id} value={m.name}>
                      {m.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ángulo
                </label>
                <select name="angulo" id="angulo">
                  <option value="HOOP_IDA">HOOP (Ida)</option>
                  <option value="±5">±5</option>
                  <option value="±6">±6</option>
                  <option value="±7">±7</option>
                  <option value="±8">±8</option>
                  <option value="±9">±9</option>
                  <option value="±10">±10</option>
                  <option value="±11">±11</option>
                  <option value="±12">±12</option>
                  <option value="±13">±13</option>
                  <option value="±14">±14</option>
                  <option value="±15">±15</option>
                  <option value="±16">±16</option>
                  <option value="±17">±17</option>
                  <option value="±18">±18</option>
                  <option value="±19">±19</option>
                  <option value="±20">±20</option>
                  <option value="±21">±21</option>
                  <option value="±22">±22</option>
                  <option value="±23">±23</option>
                  <option value="±24">±24</option>
                  <option value="±25">±25</option>
                  <option value="±26">±26</option>
                  <option value="±27">±27</option>
                  <option value="±28">±28</option>
                  <option value="±29">±29</option>
                  <option value="±30">±30</option>
                  <option value="±31">±31</option>
                  <option value="±32">±32</option>
                  <option value="±33">±33</option>
                  <option value="±34">±34</option>
                  <option value="±35">±35</option>
                  <option value="±36">±36</option>
                  <option value="±37">±37</option>
                  <option value="±38">±38</option>
                  <option value="±39">±39</option>
                  <option value="±40">±40</option>
                  <option value="±41">±41</option>
                  <option value="±42">±42</option>
                  <option value="±43">±43</option>
                  <option value="±44">±44</option>
                  <option value="±45">±45</option>
                  <option value="±46">±46</option>
                  <option value="±47">±47</option>
                  <option value="±48">±48</option>
                  <option value="±49">±49</option>
                  <option value="±50">±50</option>
                  <option value="±51">±51</option>
                  <option value="±52">±52</option>
                  <option value="±53">±53</option>
                  <option value="±54">±54</option>
                  <option value="±55">±55</option>
                  <option value="±56">±56</option>
                  <option value="±57">±57</option>
                  <option value="±58">±58</option>
                  <option value="±59">±59</option>
                  <option value="±60">±60</option>
                  <option value="±61">±61</option>
                  <option value="±62">±62</option>
                  <option value="±63">±63</option>
                  <option value="±64">±64</option>
                  <option value="±65">±65</option>
                  <option value="±66">±66</option>
                  <option value="±67">±67</option>
                  <option value="±68">±68</option>
                  <option value="±69">±69</option>
                  <option value="±70">±70</option>
                  <option value="±71">±71</option>
                  <option value="±72">±72</option>
                  <option value="±73">±73</option>
                  <option value="±74">±74</option>
                  <option value="±75">±75</option>
                  <option value="±76">±76</option>
                  <option value="±77">±77</option>
                  <option value="±78">±78</option>
                  <option value="±79">±79</option>
                  <option value="±80">±80</option>
                  <option value="±81">±81</option>
                  <option value="±82">±82</option>
                  <option value="±83">±83</option>
                  <option value="±84">±84</option>
                  <option value="±85">±85</option>
                  <option value="±86">±86</option>
                  <option value="±87">±87</option>
                  <option value="±88">±88</option>
                  <option value="±89">±89</option>
                </select>
              </div>
            </div>
            <div>
              <label  className="block text-sm font-medium text-gray-700 mb-1">
                Corrección
              </label>
              <select name="angulo" id="angulo">
                <option value="correccion_angulo">Ángulo</option>
                <option value="correccion_desfasaje">Desfasasje</option>
              </select>
            </div>
            <div>
              <label  className="block text-sm font-medium text-gray-700 mb-1">
                Pines
              </label>
              <select name="angulo" id="angulo">
                <option value="con_pines">Sí</option>
                <option value="sin_pines">No</option>
              </select>
            </div>
        </div>

        <div className="flex justify-end space-x-4 pt-4 border-t border-gray-100">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            disabled={isSubmitting}
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50"
          >
            {isSubmitting
              ? "Guardando..."
              : project
                ? "Actualizar"
                : "Generar Patrones"}
          </button>
        </div>
      </form>
    </div>
            </div >
        </div >
    );
}
