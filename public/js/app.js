const API = "/api";

function token() { return localStorage.getItem("token"); }
function user() {
  try { return JSON.parse(localStorage.getItem("user") || "{}"); }
  catch { return {}; }
}
function authHeaders() {
  return { "Content-Type": "application/json", "Authorization": `Bearer ${token()}` };
}
function requireAuth(role = null) {
  const u = user();
  if (!token()) {
    location.href = "/login.html";
    return false;
  }
  if (role && u.role !== role) {
    alert("Bạn không có quyền truy cập.");
    location.href = "/dashboard.html";
    return false;
  }
  document.querySelectorAll("[data-user-name]").forEach(el => el.textContent = u.name || "Người dùng");
  return true;
}
function logout() {
  localStorage.clear();
  location.href = "/login.html";
}
async function api(path, options = {}) {
  const res = await fetch(API + path, options);
  const data = await res.json().catch(() => ({}));
  if (res.status === 401) {
    localStorage.clear();
    location.href = "/login.html";
  }
  if (!res.ok) throw new Error(data.message || "Có lỗi xảy ra.");
  return data;
}
