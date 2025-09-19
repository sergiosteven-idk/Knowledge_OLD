import React, { useEffect, useMemo, useState } from "react";

// Endpoints (ajusta a tu backend)
const API = {
  me: "/api/users/me",
  updateMe: "/api/users/me",
  uploadAvatar: "/api/uploads/avatar",
  deleteMe: "/api/users/me",
  logout: "/api/auth/logout",
};

export default function PerfilUsuario() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    let ignore = false;
    async function load() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(API.me, { credentials: "include" });
        if (!res.ok) throw new Error(`Error ${res.status}`);
        const data = await res.json();
        if (ignore) return;
        setUser(data);
        setName(data?.name || "");
        setEmail(data?.email || "");
        setBio(data?.bio || "");
        setAvatarUrl(data?.avatarUrl || "");
      } catch (e) {
        console.error(e);
        if (!ignore) setError("No se pudo cargar el perfil.");
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    load();
    return () => { ignore = true; };
  }, []);

  const initials = useMemo(() => {
    const n = (name || email || "?").trim();
    const parts = n.split(/\s+/).filter(Boolean);
    const letters = parts.length >= 2 ? parts[0][0] + parts[1][0] : n[0];
    return letters?.toUpperCase() || "?";
  }, [name, email]);

  async function onSave(e) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const res = await fetch(API.updateMe, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name, email, bio, avatarUrl }),
      });
      if (!res.ok) throw new Error(`Error ${res.status}`);
      const updated = await res.json();
      setUser(updated);
    } catch (e) {
      console.error(e);
      setError("No se pudieron guardar los cambios.");
    } finally {
      setSaving(false);
    }
  }

  async function onPickAvatar(file) {
    if (!file) return;
    setSaving(true);
    setError("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch(API.uploadAvatar, {
        method: "POST",
        body: fd,
        credentials: "include",
      });
      if (!res.ok) throw new Error(`Error ${res.status}`);
      const { url } = await res.json();
      setAvatarUrl(url);
    } catch (e) {
      console.error(e);
      setError("No se pudo subir el avatar.");
    } finally {
      setSaving(false);
    }
  }

  async function onDelete() {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    try {
      const res = await fetch(API.deleteMe, { method: "DELETE", credentials: "include" });
      if (!res.ok) throw new Error("Error eliminando cuenta");
      alert("Cuenta eliminada");
      window.location.href = "/signup";
    } catch (e) {
      console.error(e);
      setError("No se pudo eliminar la cuenta.");
    }
  }

  async function onLogout() {
    try {
      await fetch(API.logout, { method: "POST", credentials: "include" });
    } catch {}
    window.location.href = "/login";
  }

  if (loading) {
    return (
      <Container>
        <Card>
          <div className="skeleton avatar" />
          <div className="skeleton title" />
          <div className="skeleton text" />
        </Card>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Card>
          <p className="error">{error}</p>
          <button className="btn" onClick={() => window.location.reload()}>Reintentar</button>
        </Card>
      </Container>
    );
  }

  return (
    <Container>
      <Card>
        <header className="header">
          <Avatar src={avatarUrl} initials={initials} />
          <div className="info">
            <h1 className="name">{name || "—"}</h1>
            <p className="email">{email || "—"}</p>
          </div>
          <label className="btn outline" htmlFor="avatarInput">Cambiar foto</label>
          <input id="avatarInput" type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => onPickAvatar(e.target.files?.[0])} />
        </header>

        <form className="form" onSubmit={onSave}>
          <div className="field">
            <label>Nombre</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Tu nombre" />
          </div>

          <div className="field">
            <label>Correo</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Tu correo" />
          </div>

          <div className="field">
            <label>Biografía</label>
            <textarea rows={4} value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Cuéntanos algo sobre ti" />
          </div>

          <div className="actions">
            <button className="btn primary" type="submit" disabled={saving}>{saving ? "Guardando…" : "Guardar cambios"}</button>
            <button type="button" className="btn" onClick={onLogout}>Cerrar sesión</button>
          </div>
        </form>

        <div className="actions" style={{ marginTop: "1rem" }}>
          <button className="btn danger" onClick={onDelete}>
            {confirmDelete ? "¿Seguro? Click de nuevo" : "Eliminar cuenta"}
          </button>
        </div>
      </Card>

      <Card>
        <h2 className="sectionTitle">Preferencias</h2>
        <div className="prefGrid">
          <PreferenceItem title="Modo oscuro" desc="Alterna el tema de la app.">
            <Switch defaultChecked={window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches} />
          </PreferenceItem>
          <PreferenceItem title="Notificaciones" desc="Recibir correos de actividad importante.">
            <Switch defaultChecked />
          </PreferenceItem>
        </div>
      </Card>

      <style>{styles}</style>
    </Container>
  );
}

function Container({ children }) {
  return <div className="container">{children}</div>;
}

function Card({ children }) {
  return <section className="card">{children}</section>;
}

function Avatar({ src, initials }) {
  if (src) return <img className="avatar" src={src} alt="Avatar" />;
  return <div className="avatar fallback">{initials}</div>;
}

function PreferenceItem({ title, desc, children }) {
  return (
    <div className="prefItem">
      <div>
        <div className="prefTitle">{title}</div>
        <div className="prefDesc">{desc}</div>
      </div>
      <div>{children}</div>
    </div>
  );
}

function Switch({ defaultChecked = false, onChange }) {
  const [checked, setChecked] = useState(defaultChecked);
  return (
    <button type="button" role="switch" aria-checked={checked} className={`switch ${checked ? "on" : "off"}`} onClick={() => {
      const next = !checked;
      setChecked(next);
      onChange?.(next);
    }}>
      <span className="knob" />
    </button>
  );
}

const styles = `
:root{
  --bg: #0b0c10;
  --card: #12141a;
  --muted: #9aa4b2;
  --txt: #e6e9ef;
  --brand: #6c9dff;
  --border: #20242e;
  --danger: #f87171;
  --ok: #10b981;
}
*{box-sizing:border-box}
body { background: var(--bg); color: var(--txt); }
.container { max-width: 900px; margin: 24px auto; padding: 0 16px; }
.card { background: var(--card); border: 1px solid var(--border); border-radius: 16px; padding: 20px; margin-bottom: 16px; box-shadow: 0 10px 30px rgba(0,0,0,.25); }
.header { display: grid; grid-template-columns: auto 1fr auto; gap: 16px; align-items: center; }
.avatar { width: 88px; height: 88px; border-radius: 50%; object-fit: cover; background: #1f2330; display:flex; align-items:center; justify-content:center; font-weight:700; font-size: 28px; color: var(--brand); border:1px solid var(--border) }
.avatar.fallback { letter-spacing: .5px; }
.info .name { margin: 0; font-size: 22px; }
.info .email { margin: 4px 0 0; color: var(--muted); font-size: 14px; }
.form { margin-top: 16px; display: grid; gap: 12px; }
.field label { display:block; font-size: 12px; color: var(--muted); margin-bottom: 6px; }
.field input, .field textarea { width: 100%; padding: 10px 12px; background: #0f1117; color: var(--txt); border: 1px solid var(--border); border-radius: 10px; outline: none; }
.field input:focus, .field textarea:focus { border-color: var(--brand); box-shadow: 0 0 0 3px rgba(108,157,255,0.15); }
.actions { display:flex; gap: 8px; justify-content: flex-end; margin-top: 8px; }
.btn { padding: 10px 14px; border-radius: 10px; border: 1px solid var(--border); background: #151826; color: var(--txt); cursor: pointer; }
.btn.primary { background: linear-gradient(135deg, #6c9dff, #7dd3fc); color: #0a0d16; font-weight: 600; border: none; }
.btn.outline { background: transparent; }
.btn.danger { background: var(--danger); color: #fff; border: none; }
.btn:disabled { opacity: .6; cursor: not-allowed; }
.error { color: var(--danger); margin-bottom: 12px; }
.sectionTitle { margin: 0 0 12px; }
.prefGrid { display:grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 12px; }
.prefItem { display:flex; align-items:center; justify-content:space-between; gap: 12px; padding: 12px; border:1px solid var(--border); border-radius:12px; background:#0f1117; }
.prefTitle { font-weight:600 }
.prefDesc { color: var(--muted); font-size: 12px; }
.skeleton { background: linear-gradient(90deg, #111420, #1a1f2c, #111420); background-size: 200% 100%; animation: shimmer 1.5s infinite; border-radius: 12px; }
.skeleton.avatar { width: 88px; height: 88px; border-radius: 50%; }
.skeleton.title { height: 20px; width: 40%; margin-top: 12px; }
.skeleton.text { height: 14px; width: 70%; margin-top: 8px; }
@keyframes shimmer { 0%{background-position: 200% 0} 100%{background-position: -200% 0} }
@media (max-width: 560px) {
  .header { grid-template-columns: auto 1fr; }
}
`;

