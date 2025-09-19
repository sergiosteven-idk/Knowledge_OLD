import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import Terminos from "./pages/tyc.jsx";
import A11yBar from "./components/A11yBar.jsx";


// Páginas
import Home from "./pages/home.jsx";
import Login from "./pages/login.jsx";
import Signup from "./pages/signup.jsx";
import Discapacidad from "./pages/discapacidad.jsx";
import Informacion from "./pages/informacion.jsx";
import Contacto from "./pages/contacto.jsx";
import Userhome from "./pages/userZone/userhome.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      
      {/* El contenido principal */}
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
          

          {/* Protegida */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Userhome />
              </PrivateRoute>
            }
          />

          {/* Página 404 */}
          <Route path="*" element={<h2>Página no encontrada</h2>} />
        </Routes>
      </main>

      <Footer />
    </BrowserRouter>
  );
}