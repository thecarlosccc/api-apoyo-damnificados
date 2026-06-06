import { useState } from "react";
import { registerDonante } from "../api/authApi.js";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const nav = useNavigate();
  const [msg, setMsg] = useState(null);
  const [form, setForm] = useState({
    tipo_documento: "CC",
    numero_documento: "",
    nombre_completo: "",
    correo: "",
    telefono: "",
    contrasena: "",
    rol: "donante"
  });

  function onChange(e){
    setForm(p => ({...p, [e.target.name]: e.target.value}));
  }

  async function onSubmit(e){
    e.preventDefault();
    setMsg(null);
    try{
      await registerDonante(form);
      nav("/catalogo");
    }catch(err){
      setMsg(err?.response?.data?.message || "No fue posible registrar.");
    }
  }

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-lg-7">
          <div className="card card-glass shadow-sm">
            <div className="card-body p-4">
              <h2 className="h4 fw-bold mb-3">Registro (Donante)</h2>
              {msg && <div className="alert alert-danger">{msg}</div>}

              <form onSubmit={onSubmit}>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-semibold">Tipo documento</label>
                    <select className="form-select" name="tipo_documento" value={form.tipo_documento} onChange={onChange}>
                      <option value="CC">CC</option>
                      <option value="TI">TI</option>
                      <option value="CE">CE</option>
                    </select>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-semibold">Número documento</label>
                    <input className="form-control" name="numero_documento" value={form.numero_documento} onChange={onChange} required />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Nombre completo</label>
                  <input className="form-control" name="nombre_completo" value={form.nombre_completo} onChange={onChange} required />
                </div>

                <div className="row">
                  <div className="col-md-7 mb-3">
                    <label className="form-label fw-semibold">Correo</label>
                    <input type="email" className="form-control" name="correo" value={form.correo} onChange={onChange} required />
                  </div>
                  <div className="col-md-5 mb-3">
                    <label className="form-label fw-semibold">Teléfono</label>
                    <input className="form-control" name="telefono" value={form.telefono} onChange={onChange} required />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Contraseña</label>
                  <input type="password" className="form-control" name="contrasena" value={form.contrasena} onChange={onChange} required />
                </div>

                <button className="btn btn-success" type="submit">Crear cuenta</button>
              </form>

              <div className="alert alert-secondary mt-3 mb-0">
                El registro de <b>damnificados</b> lo realiza un <b>administrador</b> desde el backend (seguridad del sistema).
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
