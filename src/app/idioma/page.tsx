import MenuIdioma from '../components/MenuIdioma'

function Idioma() {
  return (
    <section className="h-full w-full grid grid-rows-[repeat(23,1fr)] grid-cols-[repeat(18,1fr)]">

      {/* menú superior interno */}
      <header className="row-[1/7] col-[1/19] bg-blue-300">
        {/* Aquí va el contenido del header */}
        <MenuIdioma/>
      </header>

      {/* contenido principal */}
      <main className="row-[7/24] col-[1/13] bg-blue-50 grid grid-rows-[repeat(17,1fr)] grid-cols-[repeat(12,1fr)] h-full w-full">
        <p className="text-blue-950">Idioma</p>
        
      </main>

      {/* aside derecho */}
      <aside className="row-[7/24] col-[13/19] bg-blue-100">
        
      </aside>

    </section>
  );
}

export default Idioma