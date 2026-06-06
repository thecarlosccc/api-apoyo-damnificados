import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listarProductos, listarPuntosInteres } from "../api/catalogApi";

function formatUbicacion(u) {
  if (!u) return "";
  if (typeof u === "string") return u;
  const partes = [u.nombre, u.direccion, u.barrio, u.ciudad, u.departamento].filter(Boolean);
  return partes.join(" — ");
}

export default function Catalogo() {
  const [productos, setProductos] = useState([]);
  const [puntos, setPuntos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function cargar() {
    setLoading(true);
    setError("");
    try {
      const [prods, pts] = await Promise.all([listarProductos(), listarPuntosInteres()]);
      setProductos(prods);
      setPuntos(pts);
    } catch (e) {
      setError("No fue posible cargar el catálogo. Verifica que el backend esté corriendo en 127.0.0.1:3000.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    cargar();
  }, []);

  return (
    <>
      <section className="hero py-5">
        <div className="container">
          <h1 className="display-6 fw-bold mb-1">Catálogo</h1>
          <p className="mb-0 opacity-75">Productos disponibles (donaciones) y puntos de entrega.</p>
        </div>
      </section>

      <main className="py-4">
        <div className="container">
          <div className="row g-4">
            <div className="col-lg-8">
              <div className="card shadow-sm">
                <div className="card-body p-4">
                  <div className="d-flex justify-content-between align-items-center gap-2 flex-wrap">
                    <h2 className="h4 fw-bold m-0">Catálogo de productos (donaciones disponibles)</h2>
                    <button className="btn btn-outline-secondary btn-sm" onClick={cargar} disabled={loading}>
                      {loading ? "Cargando…" : "Recargar"}
                    </button>
                  </div>

                  <hr />

                  {error && <div className="alert alert-danger">{error}</div>}

                  {!error && productos.length === 0 && !loading && (
                    <div className="alert alert-secondary mb-0">No hay productos disponibles por ahora.</div>
                  )}

                  {!error && productos.length > 0 && (
                    <div className="list-group">
                      {productos.map((p) => (
                        <div key={p._id || p.id} className="list-group-item">
                          <div className="d-flex justify-content-between align-items-start gap-3 flex-wrap">
                            <div>
                              <div className="fw-semibold">{p.tipo_donacion || "Producto"}</div>
                              <div className="text-muted small">
                                {formatUbicacion(p.ubicacion_entrega) || "Ubicación por definir"}
                              </div>
                            </div>

                            <div className="d-flex align-items-center gap-2">
                              <span className="badge text-bg-success">
                                {p.cantidad ?? "-"} {p.unidad_medida || ""}
                              </span>
                              <span className="badge text-bg-dark">{(p.estado || "").toUpperCase() || "DISPONIBLE"}</span>
                            </div>
                          </div>

                          {p.descripcion && <p className="mt-2 mb-0">{p.descripcion}</p>}
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="d-flex flex-wrap gap-2 mt-4">
                    <Link className="btn btn-success" to="/admin">Ir al panel admin</Link>
                    <Link className="btn btn-outline-dark" to="/">Volver al inicio</Link>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-4">
              <div className="card shadow-sm">
                <div className="card-body p-4">
                  <h2 className="h4 fw-bold mb-3">Puntos de entrega</h2>

                  {puntos.length === 0 && !loading ? (
                    <div className="alert alert-secondary mb-0">Aún no hay puntos registrados.</div>
                  ) : (
                    <ul className="list-unstyled mb-0">
                      {puntos.slice(0, 5).map((pt) => (
                        <li key={pt._id || pt.id} className="mb-3">
                          <div className="fw-semibold">{pt.nombre || "Punto"}</div>
                          <div className="text-muted small">{formatUbicacion(pt)}</div>
                        </li>
                      ))}
                      {puntos.length > 5 && <li className="text-muted small">…y {puntos.length - 5} más</li>}
                    </ul>
                  )}

                  <div className="d-grid gap-2 mt-4">
                    <Link className="btn btn-outline-success" to="/admin/puntos-interes">
                      Gestionar puntos (admin)
                    </Link>
                    <Link className="btn btn-outline-dark" to="/">
                      Volver al inicio
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
