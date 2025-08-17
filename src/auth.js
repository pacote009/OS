// auth.js
export function login(username, password) {
  if (username === "admin" && password === "123") {
    const user = { username: "admin", role: "admin" };
    localStorage.setItem("currentUser", JSON.stringify(user));
    return user;
  }

  if (username === "user" && password === "123") {
    const user = { username: "user", role: "user" };
    localStorage.setItem("currentUser", JSON.stringify(user));
    return user;
  }

  return null;
}

export function logout() {
  localStorage.removeItem("currentUser");
}

export function getCurrentUser() {
  const user = localStorage.getItem("currentUser");
  return user ? JSON.parse(user) : null;
}
