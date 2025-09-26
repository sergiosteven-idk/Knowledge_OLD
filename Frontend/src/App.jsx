import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/navbar.jsx";
import Footer from "./components/footer.jsx";

// Páginas públicas
import Home from "./pages/home.jsx";
import Login from "./pages/login.jsx";
import Signup from "./pages/signup.jsx";
import Discapacidad from "./pages/discapacidad.jsx";
import Informacion from "./pages/informacion.jsx";
import Contacto from "./pages/contacto.jsx";
import Terminos from "./pages/tyc.jsx";

// Zona usuario
import Userhome from "./pages/userZone/userhome.jsx";

// Auth guard
import PrivateRoute from "./components/PrivateRoute.jsx";

// Zona admin
import Dashboard from "./pages/adminZone/Dashboard.jsx";
import AdminProfile from "./pages/adminZone/AdminProfile.jsx";
import ManageUser from "./pages/adminZone/Manageuser.jsx";
import UploadFiles from "./pages/adminZone/Uploadfiles.jsx";
import UserCards from "./pages/adminZone/UserCards.jsx"; 

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <main id="main-content" style={{ minHeight: "80vh" }}>
        <Routes>
          {/* Públicas */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/discapacidad" element={<Discapacidad />} />
          <Route path="/informacion" element={<Informacion />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/tyc" element={<Terminos />} />

          {/* Protegida para usuario */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute role="user">
                <Userhome />
              </PrivateRoute>
            }
          />

          {/* 🧭 Alias por compatibilidad: si algo aún navega a /userZone */}
          <Route path="/userZone" element={<Navigate to="/dashboard" replace />} />

          {/* ===== Zona Admin ===== */}
          {/* /admin -> dashboard */}
          <Route
            path="/admin"
            element={
              <PrivateRoute role="admin">
                <Navigate to="/admin/dashboard" replace />
              </PrivateRoute>
            }
          />

          <Route
            path="/admin/dashboard"
            element={
              <PrivateRoute role="admin">
                <Dashboard />
              </PrivateRoute>
            }
          />

          <Route
            path="/admin/profile"
            element={
              <PrivateRoute role="admin">
                <AdminProfile />
              </PrivateRoute>
            }
          />

          <Route
            path="/admin/manage-users"
            element={
              <PrivateRoute role="admin">
                <ManageUser />
              </PrivateRoute>
            }
          />

          <Route
            path="/admin/upload"
            element={
              <PrivateRoute role="admin">
                <UploadFiles />
              </PrivateRoute>
            }
          />

          {/* Ruta canónica de UserCards */}
          <Route
            path="/admin/cards"
            element={
              <PrivateRoute role="admin">
                <UserCards />
              </PrivateRoute>
            }
          />

          {/* 🔁 Alias/redirects para rutas antiguas o variantes */}
          <Route path="/admin/cards/" element={<Navigate to="/admin/cards" replace />} />
          <Route path="/admin/usercards" element={<Navigate to="/admin/cards" replace />} />
          <Route path="/admin/UserCards" element={<Navigate to="/admin/cards" replace />} />
          <Route path="/admin/usercard" element={<Navigate to="/admin/cards" replace />} />
          <Route path="/admin/UserCard" element={<Navigate to="/admin/cards" replace />} />
          <Route path="/admin/user-cards" element={<Navigate to="/admin/cards" replace />} />
          <Route path="/admin/upload-files" element={<Navigate to="/admin/upload" replace />} />

          {/* 404 */}
          <Route path="*" element={<h2>Página no encontrada</h2>} />
        </Routes>
      </main>

      <Footer />
    </BrowserRouter>
  );
}
