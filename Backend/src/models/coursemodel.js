// Simulación de cursos (por ahora sin DB real)
const cursos = [
  { id: 1, nombre: "Curso de Node.js" },
  { id: 2, nombre: "Curso de React" },
  { id: 3, nombre: "Curso de MySQL" },
];

function getCursos() {
  return cursos;
}

function getMisCursos(userId) {
  return cursos.filter(curso => curso.id % 2 === Number(userId) % 2);
}

module.exports = { getCursos, getMisCursos };
