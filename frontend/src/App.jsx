import { useEffect, useMemo, useState } from 'react'
import './App.css'

const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://127.0.0.1:8000'
const SESSION_KEY = 'compliance-platform-session'
const LOGIN_PATH = '/'
const WELCOME_PATH = '/welcome'

function readSession() {
  const session = window.sessionStorage.getItem(SESSION_KEY)
  if (!session) {
    return null
  }

  try {
    return JSON.parse(session)
  } catch {
    window.sessionStorage.removeItem(SESSION_KEY)
    return null
  }
}

function saveSession(session) {
  window.sessionStorage.setItem(SESSION_KEY, JSON.stringify(session))
}

function clearSession() {
  window.sessionStorage.removeItem(SESSION_KEY)
}

function getCurrentPath() {
  return window.location.pathname === WELCOME_PATH ? WELCOME_PATH : LOGIN_PATH
}

function navigate(nextPath, replace = false) {
  const method = replace ? 'replaceState' : 'pushState'
  window.history[method]({}, '', nextPath)
  window.dispatchEvent(new PopStateEvent('popstate'))
}

function formatStoredAt(value) {
  return new Intl.DateTimeFormat('es-AR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(new Date(value))
}

function App() {
  const [path, setPath] = useState(getCurrentPath)
  const [session, setSession] = useState(readSession)
  const [formData, setFormData] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const syncPath = () => {
      setPath(getCurrentPath())
      setSession(readSession())
    }

    window.addEventListener('popstate', syncPath)
    window.addEventListener('storage', syncPath)

    return () => {
      window.removeEventListener('popstate', syncPath)
      window.removeEventListener('storage', syncPath)
    }
  }, [])

  useEffect(() => {
    if (path === WELCOME_PATH && !session) {
      navigate(LOGIN_PATH, true)
    }

    if (path === LOGIN_PATH && session) {
      navigate(WELCOME_PATH, true)
    }
  }, [path, session])

  const sessionDetails = useMemo(() => {
    if (!session) {
      return []
    }

    return [
      { label: 'Usuario', value: session.username },
      { label: 'Token', value: `${session.accessToken.slice(0, 18)}...` },
      { label: 'Expira en', value: `${session.expiresIn} segundos` },
      { label: 'Inicio de sesión', value: formatStoredAt(session.storedAt) },
    ]
  }, [session])

  async function handleSubmit(event) {
    event.preventDefault()
    setIsSubmitting(true)
    setError('')

    try {
      const response = await fetch(`${API_BASE_URL}/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.detail || 'No fue posible iniciar sesión.')
      }

      const nextSession = {
        username: formData.username,
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
        expiresIn: data.expires_in,
        storedAt: new Date().toISOString(),
      }

      saveSession(nextSession)
      setSession(nextSession)
      setFormData({ username: '', password: '' })
      navigate(WELCOME_PATH)
    } catch (submitError) {
      setError(submitError.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  function handleLogout() {
    clearSession()
    setSession(null)
    navigate(LOGIN_PATH)
  }

  return (
    <main className="shell">
      <div className="ambient ambient-left" aria-hidden="true" />
      <div className="ambient ambient-right" aria-hidden="true" />
      <section className="frame">
        <header className="hero-copy">
          <p className="eyebrow">Compliance Platform</p>
          <h1>{path === LOGIN_PATH ? 'Iniciar sesión' : 'Bienvenido'}</h1>
          <p className="hero-text">
            Accedé a la plataforma con tu usuario autorizado y mantené la sesión activa
            únicamente durante la pestaña actual.
          </p>
        </header>

        {path === LOGIN_PATH ? (
          <section className="glass-card auth-card" aria-label="Formulario de login">
            <div className="card-surface">
              <div className="card-heading">
                <p className="section-label">Autenticación</p>
                <h2>Credenciales del backend</h2>
                <p>
                  El formulario consume el endpoint <code>POST /token</code> del servicio FastAPI.
                </p>
              </div>

              <form className="auth-form" onSubmit={handleSubmit}>
                <label>
                  Usuario
                  <input
                    type="text"
                    name="username"
                    autoComplete="username"
                    value={formData.username}
                    onChange={(event) =>
                      setFormData((current) => ({ ...current, username: event.target.value }))
                    }
                    placeholder="admin"
                    required
                  />
                </label>

                <label>
                  Contraseña
                  <input
                    type="password"
                    name="password"
                    autoComplete="current-password"
                    value={formData.password}
                    onChange={(event) =>
                      setFormData((current) => ({ ...current, password: event.target.value }))
                    }
                    placeholder="admin123"
                    required
                  />
                </label>

                {error ? (
                  <p className="message error" role="alert">
                    {error}
                  </p>
                ) : (
                  <p className="message hint">
                    Sesión guardada en <strong>sessionStorage</strong>.
                  </p>
                )}

                <button className="primary-button" type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Validando…' : 'Ingresar'}
                </button>
              </form>
            </div>
          </section>
        ) : (
          <section className="welcome-grid" aria-label="Panel de bienvenida">
            <article className="glass-card welcome-card">
              <div className="card-surface">
                <div className="card-heading">
                  <p className="section-label">Sesión activa</p>
                  <h2>Acceso autorizado</h2>
                  <p>
                    Llegaste a esta vista porque existe una sesión válida en el navegador actual.
                  </p>
                </div>

                <dl className="session-list">
                  {sessionDetails.map((item) => (
                    <div key={item.label} className="session-row">
                      <dt>{item.label}</dt>
                      <dd>{item.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </article>

            <aside className="glass-card info-card">
              <div className="card-surface">
                <div className="card-heading">
                  <p className="section-label">Protección de ruta</p>
                  <h2>Navegación controlada</h2>
                  <p>
                    Si eliminás la sesión o abrís la ruta directamente sin token, la app vuelve al
                    login.
                  </p>
                </div>

                <button className="secondary-button" type="button" onClick={handleLogout}>
                  Cerrar sesión
                </button>
              </div>
            </aside>
          </section>
        )}
      </section>
    </main>
  )
}

export default App
