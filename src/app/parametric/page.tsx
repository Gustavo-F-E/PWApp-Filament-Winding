//import ParametricCurveWithControls from "../components/ParametricCurve";ParametricCurveWithCylinder
import ParametricCurveWithCylinder from "../components/ParametricCurve";

export default function ParametricPage() {
  return (
    <div>
      <h1 style={{ textAlign: "center", color: "white", position: "absolute", width: "100%", zIndex: 1 }}>
        Curva Paramétrica con Three.js
      </h1>
      <ParametricCurveWithCylinder />
    </div>
  );
}
