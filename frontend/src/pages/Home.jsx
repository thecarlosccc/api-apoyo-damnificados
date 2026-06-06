import Swal from "sweetalert2";
import { useEffect } from "react";
import { Link } from "react-router-dom";

export default function Home() {
  useEffect(() => {
    Swal.fire({
      title: "Ayuda Córdoba",
      text: "Sistema web para apoyar a la comunidad: catálogo, registro y gestión de ayudas.",
      icon: "info",
      confirmButtonText: "Continuar",
    });
  }, []);

  return (
    <div className="container py-4">
      <div className="card card-glass shadow-sm">
        <div className="card-body p-4">
          <h1 className="h3 fw-bold mb-2">Ayuda Córdoba</h1>
          <p className="text-muted mb-3">
            Plataforma para registrar donantes, damnificados, donaciones y puntos de interés, con control de acceso.
          </p>
          <div className="d-flex gap-2 flex-wrap">
            <Link className="btn btn-success" to="/catalogo">
              Ver catálogo
            </Link>
            <Link className="btn btn-outline-dark" to="/login">
              Iniciar sesión
            </Link>
            <Link className="btn btn-outline-secondary" to="/registro">
              Registrarme (donante)
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
