import { NavLink, useNavigate } from "react-router-dom";
import { getUser, logout } from "../api/authApi.js";

export default function Navbar() {
  const user = getUser();
  const nav = useNavigate();

  const linkClass = ({ isActive }) =>
    "nav-link" + (isActive ? " active fw-bold" : "");

  function doLogout() {
    logout();
    nav("/");
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark border-bottom border-success border-3">
      <div className="container">
        <NavLink className="navbar-brand d-flex align-items-center gap-2" to="/">
          <span className="brand-badge">AC</span>
          <div className="d-none d-sm-block lh-sm">
            <div className="fw-bold">Ayuda Córdoba</div>
            <div className="small opacity-75">TCC</div>
          </div>
        </NavLink>

        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navMain">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navMain">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item"><NavLink className={linkClass} to="/catalogo">Catálogo</NavLink></li>
            {!user && (
              <>
                <li className="nav-item"><NavLink className={linkClass} to="/login">Login</NavLink></li>
                <li className="nav-item"><NavLink className={linkClass} to="/registro">Registro</NavLink></li>
              </>
            )}
            {user?.rol === "administrador" && (
              <li className="nav-item"><NavLink className={linkClass} to="/admin">Admin</NavLink></li>
            )}
            {user && (
              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle" role="button" data-bs-toggle="dropdown" href="#">
                  {user.nombre_completo || "Usuario"}
                </a>
                <ul className="dropdown-menu dropdown-menu-end">
                  <li><span className="dropdown-item-text">Rol: {user.rol}</span></li>
                  <li><hr className="dropdown-divider" /></li>
                  <li><button className="dropdown-item" onClick={doLogout}>Salir</button></li>
                </ul>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
