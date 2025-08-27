import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar";
import Footer from "./components/footer";

// Páginas
import Home from "./pages/home";
import Login from "./pages/login";
import Signup from "./pages/signup";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <main style={{ minHeight: "80vh", padding: "20px" }}>
        <Routes>
          <Route path="/" element={<Home />} /> 
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </main>

      <Footer />
    </BrowserRouter>
  );
}
