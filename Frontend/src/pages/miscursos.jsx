import { useEffect, useState } from "react";
import { getMisCursos } from "../services/api";

export default function MisCursos() {
  const [misCursos, setMisCursos] = useState([]);

  useEffect(() => {
    getMisCursos(1).then(res => setMisCursos(res.data));
  }, []);

  return (
    <div>
      <h1>Mis Cursos</h1>
      <ul>
        {misCursos.map(curso => <li key={curso.id}>{curso.nombre}</li>)}
      </ul>
    </div>
  );
}
