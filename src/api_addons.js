// src/api_addons.js
export const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost/sofar_api";

async function req(path) {
  const r = await fetch(API_BASE + path, { credentials: "include" });
  const data = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(data.error || `HTTP ${r.status}`);
  return data;
}

// Normaliza cualquier cosa a array
function toArray(data) {
  if (Array.isArray(data)) return data;
  if (data == null) return [];
  // A veces el backend devuelve {data:[...]} o un objeto indexado
  if (Array.isArray(data.data)) return data.data;
  if (typeof data === 'object') return Object.values(data);
  return [];
}

export const apiAddons = {
  lotes: async (medicamento_id, soloDisponibles = true) => {
    const q = new URLSearchParams();
    if (medicamento_id) q.set('medicamento_id', medicamento_id);
    if (soloDisponibles) q.set('solo_disponibles', '1');
    const raw = await req("/lotes/index.php?" + q.toString());
    return toArray(raw);
  },
  alerts: async (days = 30) => {
    const raw = await req(`/dashboard/alerts.php?days=${days}`);
    // Aquí esperamos { low_stock:[], expiring_soon:[] } — lo dejamos tal cual
    return raw;
  },
  stats: (days = 30) => req(`/dashboard/stats.php?days=${days}`),
};

export default apiAddons;
