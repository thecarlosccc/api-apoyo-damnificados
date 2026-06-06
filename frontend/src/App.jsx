import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Catalogo from "./pages/Catalogo.jsx";
import Admin from "./pages/Admin.jsx";
import { getToken, getUser } from "./api/authApi.js";

function ProtectedRoute({ children, roles }) {
  const token = getToken();
  const user = getUser();
  if (!token) return <Navigate to="/login" replace />;
  if (roles?.length && (!user || !roles.includes(user.rol))) return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/catalogo" element={<Catalogo />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Register />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute roles={["administrador"]}>
                <Admin />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
