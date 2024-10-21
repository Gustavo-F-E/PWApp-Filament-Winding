/*
En Next.js, la directiva "use client" se utiliza para indicar que un componente o archivo específico debe ejecutarse en el cliente en lugar del servidor. A partir de Next.js 13, el enfoque predeterminado es el renderizado en el servidor (Server-Side Rendering o SSR) para los componentes en las páginas del proyecto. Sin embargo, en algunos casos, se requiere que ciertos componentes se ejecuten en el navegador (cliente), y es allí donde entra en juego "use client".
*/
"use client";
import { useRef, useEffect } from "react";
import { Chart } from "chart.js/auto";

// Extiende el tipo de chartRef para agregar la propiedad 'chart'
interface CanvasRef extends HTMLCanvasElement {
  chart?: Chart; // La propiedad 'chart' es opcional
}

// Define los tipos de props para el componente
interface Labels {
  labels: string[]; // Las etiquetas que se pasarán desde cada página
}

export default function Ejemplo({ labels }: Labels) {
  const chartRef = useRef<CanvasRef | null>(null); // Define el tipo correcto para chartRef

  useEffect(() => {
    if (chartRef.current) {
      // Destruye el gráfico anterior si existe
      if (chartRef.current.chart) {
        chartRef.current.chart.destroy();
      }

      const context = chartRef.current.getContext("2d");

      if (context) {
        // Crea un nuevo gráfico
        const newChart = new Chart(context, {
          type: "bar",
          data: {
            labels: labels, // Usa las etiquetas pasadas como prop,
            datasets: [
              {
                label: "Datos",
                data: [65, 59, 80],
                backgroundColor: [
                  "rgba(255, 99, 132, 0.2)",
                  "rgba(255, 159, 64, 0.2)",
                  "rgba(255, 205, 86, 0.2)",
                ],
                borderColor: [
                  "rgb(255, 99, 132)",
                  "rgb(255, 159, 64)",
                  "rgb(255, 205, 86)",
                ],
                borderWidth: 1,
              },
            ],
          },
          options: {
            scales: {
              x: {
                type: "category",
              },
              y: {
                beginAtZero: true,
              },
            },
          },
        });

        // Guarda el gráfico en la referencia
        chartRef.current.chart = newChart;
      }
    }
  }, []);

  return (
    <div style={{ position: "relative", width: "80vw", height: "80vh" }}>
      <h2>Ejemplo 1</h2>
      <canvas ref={chartRef} />
    </div>
  );
}
