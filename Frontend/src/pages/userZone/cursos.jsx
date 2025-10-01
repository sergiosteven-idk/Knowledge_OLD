import { useEffect, useState } from "react";
import { getCursos } from "../services/api";

export default function Cursos() {
  const [cursos, setCursos] = useState([]);

  useEffect(() => {
    getCursos().then(res => setCursos(res.data));
  }, []);

  return (
    <div>
      <h1>Cursos</h1>
      <ul>
        {cursos.map(curso => <li key={curso.id}>{curso.nombre}</li>)}
      </ul>
    </div>
  );
}
