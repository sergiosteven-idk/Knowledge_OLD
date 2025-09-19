import axios from "axios";

const API_URL = "http://localhost:5173/api";

export const getCursos = () => axios.get(`${API_URL}/cursos`);
export const getMisCursos = (userId) => axios.get(`${API_URL}/cursos/mis-cursos/${userId}`);
export const getPerfil = (userId) => axios.get(`${API_URL}/usuarios/perfil/${userId}`);
