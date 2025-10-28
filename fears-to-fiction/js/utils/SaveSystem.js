export class SaveSystem {
  static set(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
  }
  static get(key, fallback=null) {
    try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch { return fallback; }
  }
}

