// src/auth.js
import { loginUser } from "./services/api";

export async function login(username, password) {
  try {
    const user = await loginUser(username, password);

    if (user) {
      localStorage.setItem("currentUser", JSON.stringify(user));
      return user;
    }
    return null;
  } catch (error) {
    console.error("Erro no login:", error.message);
    return null;
  }
}

export function logout() {
  localStorage.removeItem("currentUser");
}

export function getCurrentUser() {
  const user = localStorage.getItem("currentUser");
  return user ? JSON.parse(user) : null;
}
