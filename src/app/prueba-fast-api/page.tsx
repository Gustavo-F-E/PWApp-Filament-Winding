// app/page.tsx

"use client"; // Indica que este es un Client Component

import React from 'react';
import styles from '../css/formulario.module.css';

const Page = () => {
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault(); // Evita el envío normal del formulario

        const formData = new FormData(event.currentTarget);
        console.log("Petición enviada"); // Mensaje al enviar la petición

        const response = await fetch("https://fast-api-filpath.vercel.app/generate-and-download-plot/", {
            method: "POST",
            body: JSON.stringify({
                X: parseFloat(formData.get("X") as string),
                Y: parseFloat(formData.get("Y") as string),
                Z: parseFloat(formData.get("Z") as string),
            }),
            headers: {
                "Content-Type": "application/json"
            }
        });

        if (response.ok) {
            // Aquí obtenemos el blob de la imagen
            const blob = await response.blob();
            const url = URL.createObjectURL(blob);

            // Establecer la fuente de la imagen al URL del blob
            const imageElement = document.getElementById("plotImage") as HTMLImageElement;
            imageElement.src = url;
            imageElement.style.display = "block";

            // Mensaje al recibir la imagen
            console.log("Petición recibida"); // Mensaje al recibir la imagen

            // Opcional: Crear un enlace para descargar la imagen
            const link = document.createElement('a');
            link.href = url;
            link.download = `plot_X=${formData.get("X")}_Y=${formData.get("Y")}_Z=${formData.get("Z")}.png`;
            link.innerText = 'Descargar imagen';
            document.body.appendChild(link);
        } else {
            console.error("Error al generar el gráfico:", response.statusText);
        }
    };

    return (
<div className={styles.divFormulario}>
        <h1 className={styles.h1}>Generar Gráfico 3D</h1>
        <form id="plotForm" className={styles.formulario} onSubmit={handleSubmit}>
            <label htmlFor="X">Valor de X:</label>
            <input type="number" id="X" name="X" required />
            <br />
            <label htmlFor="Y">Valor de Y:</label>
            <input type="number" id="Y" name="Y" required />
            <br />
            <label htmlFor="Z">Valor de Z:</label>
            <input type="number" id="Z" name="Z" required />
            <br /><br />
            <button type="submit">Generar y Descargar Gráfico</button>
        </form>

        <h2 className={styles.h2}>Gráfico Generado:</h2>
        <img id="plotImage" src="" alt="Gráfico 3D" style={{ display: 'none', maxWidth: '100%', height: 'auto', marginTop: '20px' }} />
    </div>
    );
};

export default Page;
