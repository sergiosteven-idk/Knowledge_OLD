import { useEffect, useState } from "react";
import { getPerfil } from "../services/api";

export default function Perfil() {
  const [perfil, setPerfil] = useState(null);

  useEffect(() => {
    getPerfil(1).then(res => setPerfil(res.data));
  }, []);

  return (
    <div>
      <h1>Perfil</h1>
      {perfil && (
        <div>
          <p><strong>Nombre:</strong> {perfil.nombre}</p>
          <p><strong>Email:</strong> {perfil.correo}</p>
        </div>
      )}
    </div>
  );
}
