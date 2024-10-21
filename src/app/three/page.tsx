import ThreeCube from "../components/ThreeCube";

export default function ThreePage() {
  return (
    <div>
      <h1 style={{ textAlign: "center", color: "white", position: "absolute", width: "80vw", height:"80vh", zIndex: 1 }}>
        Cubo 3D con Three.js
      </h1>
      <ThreeCube />
    </div>
  );
}

