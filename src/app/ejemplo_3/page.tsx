import Ejemplo from '../components/grafico_de_barras';

export default function Pagina2() {
  return (
    <div>
      <h1>Página 2</h1>
      <Ejemplo labels={["Juan", "Pepe", "Pepo"]} />
    </div>
  );
}