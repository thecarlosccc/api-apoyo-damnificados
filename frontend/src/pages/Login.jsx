import { useState } from "react";
import { login } from "../api/authApi.js";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [form, setForm] = useState({ login: "", contrasena: "" });
  const [msg, setMsg] = useState(null);
  const nav = useNavigate();

  function onChange(e){
    setForm(p => ({...p, [e.target.name]: e.target.value}));
  }

  async function onSubmit(e){
    e.preventDefault();
    setMsg(null);
    try{
      await login(form.login, form.contrasena);
      nav("/catalogo");
    }catch(err){
      setMsg(err?.response?.data?.message || "No fue posible iniciar sesión.");
    }
  }

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-lg-6">
          <div className="card card-glass shadow-sm">
            <div className="card-body p-4">
              <h2 className="h4 fw-bold mb-3">Iniciar sesión</h2>
              {msg && <div className="alert alert-danger">{msg}</div>}
              <form onSubmit={onSubmit}>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Correo o documento</label>
                  <input className="form-control" name="login" value={form.login} onChange={onChange} required />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Contraseña</label>
                  <input type="password" className="form-control" name="contrasena" value={form.contrasena} onChange={onChange} required />
                </div>
                <button className="btn btn-success" type="submit">Entrar</button>
              </form>
              <p className="text-muted small mt-3 mb-0">
                Nota: el registro de damnificados lo realiza un administrador.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
