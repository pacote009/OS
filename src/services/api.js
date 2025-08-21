// src/services/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000", // ❌ tirei o /api porque json-server não usa
});

// Dashboard
export const getDashboardData = async () => {
  const response = await api.get("/dashboard");
  return response.data;
};

// "Login" fake: aqui buscamos o usuário no db.json
export const loginUser = async (username, password) => {
  const response = await api.get(`/users?username=${username}&password=${password}`);
  
  if (response.data.length > 0) {
    return response.data[0]; // retorna o usuário encontrado
  } else {
    throw new Error("Usuário ou senha inválidos!");
  }
};

// Listar atividades
export const getAtividades = async () => {
  const response = await api.get("/atividades");
  return response.data;
};

export default api;

// Projetos
export const getProjetos = async () => {
  const response = await api.get("/projetos");
  return response.data;
};

export const addProjeto = async (projeto) => {
  const response = await api.post("/projetos", projeto);
  return response.data;
};

export const likeProjeto = async (id, likes) => {
  const response = await api.patch(`/projetos/${id}`, { likes });
  return response.data;
};

export const addComentario = async (id, comentario) => {
  const projeto = await api.get(`/projetos/${id}`);
  const novosComentarios = [...projeto.data.comentarios, comentario];
  const response = await api.patch(`/projetos/${id}`, { comentarios: novosComentarios });
  return response.data;
};

// Atualizar atividade (concluir, mudar status, etc.)
export const updateAtividade = async (id, data) => {
  const response = await api.patch(`/atividades/${id}`, data);
  return response.data;
};

// Adicionar comentário em atividade
export const addComentarioAtividade = async (id, comentario) => {
  const atividade = await api.get(`/atividades/${id}`);
  const novosComentarios = [...atividade.data.comentarios, comentario];
  const response = await api.patch(`/atividades/${id}`, { comentarios: novosComentarios });
  return response.data;
};

// Criar nova atividade
export const addAtividade = async (atividade) => {
  const response = await api.post("/atividades", atividade);
  return response.data;
};
