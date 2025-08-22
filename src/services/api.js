// src/services/api.js
import axios from "axios";
import { getCurrentUser } from "../auth";

const BASE_URL = "http://localhost:5000";

const api = axios.create({
  baseURL: BASE_URL,
});

/**
 * Dashboard
 */
export const getDashboardData = async () => {
  const response = await api.get("/dashboard");
  return response.data;
};

/**
 * Login
 */
export const loginUser = async (username, password) => {
  const response = await api.get(`/users?username=${username}&password=${password}`);
  if (response.data.length > 0) {
    return response.data[0];
  } else {
    throw new Error("Usuário ou senha inválidos!");
  }
};

/**
 * Buscar atividades com filtro, ordenação e paginação no cliente
 */
export const getAtividades = async (
  status,
  page = 1,
  limit = 5,
  order = "desc",
  search = ""
) => {
  const user = getCurrentUser();

  const res = await api.get("/atividades", { params: { status } });
  let list = Array.isArray(res.data) ? res.data : [];

  // Filtrar por assignedTo (somente admin vê todas)
  if (user.role !== "admin") {
    list = list.filter(
      (item) => !item.assignedTo || item.assignedTo === user.username
    );
  }

  // Filtro por título ou descrição (parcial)
  const term = search.trim().toLowerCase();
  if (term) {
    list = list.filter((item) => {
      const t = (item.title || "").toLowerCase();
      const d = (item.description || "").toLowerCase();
      return t.includes(term) || d.includes(term);
    });
  }

  // Ordenação
  const getKey = (it) => {
    if (it.createdAt) return { type: "num", v: Number(it.createdAt) };
    const n = Number(it.id);
    if (!Number.isNaN(n)) return { type: "num", v: n };
    return { type: "str", v: String(it.id || "") };
  };

  list.sort((a, b) => {
    const ka = getKey(a);
    const kb = getKey(b);

    let cmp = 0;
    if (ka.type === "num" && kb.type === "num") cmp = ka.v - kb.v;
    else cmp = String(ka.v).localeCompare(String(kb.v));

    return order === "asc" ? cmp : -cmp;
  });

  // Paginação
  const total = list.length;
  const start = (page - 1) * limit;
  const end = start + limit;
  const data = list.slice(start, end);

  return { data, total };
};

/**
 * Adicionar nova atividade
 */
export const addAtividade = async (atividade) => {
  const payload = {
    createdAt: Date.now(),
    ...atividade,
  };
  const res = await api.post("/atividades", payload);
  return res.data;
};

/**
 * Atualizar atividade
 */
export const updateAtividade = async (id, data) => {
  const response = await api.patch(`/atividades/${id}`, data);
  return response.data;
};

/**
 * Adicionar comentário
 */
export const addComentarioAtividade = async (id, comentario) => {
  const atividade = await api.get(`/atividades/${id}`);
  const novosComentarios = [...atividade.data.comentarios, comentario];
  const response = await api.patch(`/atividades/${id}`, { comentarios: novosComentarios });
  return response.data;
};

/**
 * Projetos
 */
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

/**
 * Fixar atividade para usuário específico
 */
export const assignAtividade = async (id, username) => {
  const response = await api.patch(`/atividades/${id}`, { assignedTo: username });
  return response.data;
};

export const getUsers = async () => {
  const response = await api.get("/users");
  return response.data;
};

export default api;
