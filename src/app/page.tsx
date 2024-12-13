import styles from './menuInicio.module.css';

export default function Home() {
  return (
    <section className={styles.container}>
      <p  className={styles.primerParrafo}>
        La App <span>Filament Path Generator</span> es un desarrollo personal realizado en el <span>Centro Atómico Contituyentes (CAC)</span> de la <span>CNEA</span>. Se deseaba contar con un software propio para el cálculo de los patrones correspondientes al procesado mediante <span>Filament Winding</span>, para la máquina que se cuenta en las instalaciones del edificio <span>ARAS (Antena Radar de apertura sintética)</span> del <span>CAC</span>. Dicho software debe cumplir los siguientes objetivos:
        </p>
        <ul className={styles.listaObjetivos}>
          <li>Obtener el Código-G para fabricar un tubo mediante la técnica de Filament-Winding.</li>
          <li>La App se debe adaptar a diferentes dispositivos, e incluso a PC de escritorio con sistemas operativos muy antiguos sin conexión a internet.</li>
          <li>La App App debe proveer elementos de análisis mediante elementos finitos y renderizados para previsualizar el proceso de fabricación.</li>
          <li>Tambien debe ser intuitiva, fácil de usar y debe proveer el acceso a la documentación y/o videos para aprender a usarla (ver <a href="#minitutorial">Minitutorial</a> ).</li>
      </ul>
      <p>En esta primera versión, se ofrece el cálculo para mandriles únicamente cilíndricos, pero a futuro se piensa extender las capacidades para todo tipo de mandriles.</p>
      <p><h2 id='minitutorial' className={styles.h2}>Minitutorial</h2></p>

    </section>
  );
}