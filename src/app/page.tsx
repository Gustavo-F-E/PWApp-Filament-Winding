import Image from "next/image";
import MenuIniciarSesion from './components/MenuIniciarSesion'
import {FillWindPathIcon } from './components/IconosSVG';

function Home() {
  return (
    <section className="h-full w-full grid grid-rows-[repeat(23,1fr)] grid-cols-[repeat(18,1fr)]">

      {/* menú superior interno */}
      <header className="row-[1/7] col-[1/19] bg-blue-300">
        {/* Aquí va el contenido del header */}
        <MenuIniciarSesion/>
      </header>

      {/* contenido principal */}
      <main className="row-[7/24] col-[1/13] bg-blue-50 grid grid-rows-[repeat(17,1fr)] grid-cols-[repeat(12,1fr)] h-full w-full">
        <p className="row-[3/7] col-[3/11] text-blue-950 text-center text-lg"><span className="font-bold">Filwind</span> &nbsp;
          <FillWindPathIcon 
              className="inline-block w-[1.5em] h-[1.5em] align-middle" 
              colorClass="#000000" 
            /> 
          &nbsp;es un software libre diseñado para obtener el código G de los patrones de bobinados de piezas fabricadas mediante Filament Winding.</p>
          <p className="row-[7/9] col-[3/11] flex items-center justify-center">
            <Image
            src="/images/icons/alert.svg"
            alt="Alerta"
            width={40}
            height={40}
            className="inline-block"
          /> 
          </p>
          <p className="row-[9/11] col-[3/11] text-blue-950 text-center text-lg">
            Para comenzar a utilizar <span className="font-bold">Filwind</span> &nbsp;
            
            <FillWindPathIcon 
              className="inline-block w-[1.5em] h-[1.5em] align-middle" 
              colorClass="#000000" 
            />
            
            &nbsp; debes Iniciar Sesión.
          </p>
      </main>

      {/* aside derecho */}
      <aside className="row-[7/24] col-[13/19] bg-blue-100">
        
      </aside>

    </section>
  );
}

export default Home