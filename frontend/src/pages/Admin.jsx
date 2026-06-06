import { useEffect, useState } from "react";
import api from "../api/axiosClient";

export default function Admin() {
  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  async function cargarUsuarios() {
    setCargando(true);
    setError("");
    try {
      const { data } = await api.get("/api/users");
      setUsuarios(Array.isArray(data) ? data : []);
    } catch (e) {
      setError("No se pudo cargar la lista de usuarios. Inicia sesión como ADMIN y vuelve a intentar.");
      setUsuarios([]);
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    cargarUsuarios();
  }, []);

  return (
    <>
      <section className="hero py-5">
        <div className="container">
          <h1 className="display-6 fw-bold mb-1">Panel de administración</h1>
          <p className="mb-0 opacity-75">Gestión de usuarios del sistema (solo administrador).</p>
        </div>
      </section>

      <main className="py-4">
        <div className="container">
          <div className="card shadow-sm">
            <div className="card-body p-4">
              <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
                <h2 className="h4 fw-bold m-0">Usuarios registrados</h2>
                <button className="btn btn-outline-secondary btn-sm" onClick={cargarUsuarios} disabled={cargando}>
                  {cargando ? "Cargando…" : "Recargar"}
                </button>
              </div>

              <hr />

              {error && <div className="alert alert-danger">{error}</div>}

              {!error && usuarios.length === 0 && !cargando && (
                <div className="alert alert-secondary mb-0">No hay usuarios para mostrar.</div>
              )}

              {!error && usuarios.length > 0 && (
                <div className="table-responsive">
                  <table className="table align-middle">
                    <thead>
                      <tr>
                        <th>Nombre</th>
                        <th>Correo</th>
                        <th>Documento</th>
                        <th>Rol</th>
                      </tr>
                    </thead>
                    <tbody>
                      {usuarios.map((u) => (
                        <tr key={u._id || u.id}>
                          <td className="fw-semibold">{u.nombre_completo}</td>
                          <td>{u.correo}</td>
                          <td>
                            {u.tipo_documento} {u.numero_documento}
                          </td>
                          <td>
                            <span className="badge text-bg-dark">{u.rol}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              <p className="text-muted small mb-0">
                Nota: este panel se conecta al backend protegido con JWT. Si el token no es válido o no es de
                administrador, el servidor responde 401/403.
              </p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
