import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, Link } from 'react-router';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import { FaArrowCircleLeft, FaEdit, FaTimes, FaCheck } from 'react-icons/fa';
import { Toaster, toast } from 'sonner';

export default function ProfileUser() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [lastSyncAt, setLastSyncAt] = useState(null);
  const [loading, setLoading] = useState(true);

  // Edit username UI state
  const [editing, setEditing] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [loggingOut, setLoggingOut] = useState(false);

  const initials = useMemo(() => {
    if (!user?.username) return '';
    const parts = String(user.username).trim().split(/\s+/);
    return parts.slice(0, 2).map(p => p[0]?.toUpperCase()).join('');
  }, [user]);

  useEffect(() => {
    let canceled = false;
    async function load() {
      try {
        setLoading(true);
        const session = await window.electron.getActiveSession();
        if (canceled) return;

        if (!session?.user_id) {
          navigate('/login');
          return;
        }
        setUser(session);
        setNewUsername(session.username || '');

        const sync = await window.electron.getLastSyncAt();
        if (canceled) return;
        setLastSyncAt(sync || null);
      } finally {
        if (!canceled) setLoading(false);
      }
    }
    load();
    return () => { canceled = true; };
  }, [navigate]);

  const validateUsername = (value) => {
    const v = String(value || '').trim();
    if (v.length < 3) return 'El nombre de usuario debe tener al menos 3 caracteres.';
    if (v.length > 30) return 'El nombre de usuario no puede superar 30 caracteres.';
    // Letras, números, espacios, guion y guion bajo
    if (!/^[A-Za-zÁÉÍÓÚáéíóúÜüÑñ0-9 _-]+$/.test(v)) return 'Usa solo letras, números, espacios, guion y guion bajo.';
    return '';
  };

  const startEdit = () => {
    setNewUsername(user?.username || '');
    setErrorMsg('');
    setEditing(true);
  };

  const cancelEdit = () => {
    setNewUsername(user?.username || '');
    setErrorMsg('');
    setEditing(false);
  };

  const saveUsername = async () => {
    const err = validateUsername(newUsername);
    if (err) {
      setErrorMsg(err);
      return;
    }
    try {
      setSaving(true);
      setErrorMsg('');
      const result = await window.electron.updateUsername(String(newUsername).trim());
      // Actualiza UI local
      setUser(prev => ({ ...prev, username: result.username }));
      setEditing(false);
      toast.success('Nombre de usuario actualizado');
    } catch (e) {
      setErrorMsg(e?.message || 'No se pudo actualizar el nombre de usuario.');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      await window.electron.deleteSession();
      navigate('/login');
    } finally {
      setLoggingOut(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
        <div className="flex items-center gap-3 text-gray-700">
          <div className="h-6 w-6 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin" />
          <span>Cargando perfil…</span>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen overflow-x-hidden overflow-y-auto bg-gray-50">
      <Toaster position="top-center" richColors />
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Back link */}
        <div className="mb-4">
          <Link to="/folders" className="inline-flex items-center gap-2 hover:text-indigo-700 font-medium">
            <FaArrowCircleLeft className="h-5 w-5" />
            Volver a Mis Carpetas
          </Link>
        </div>

        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Perfil de usuario</h1>
          <p className="text-gray-600 mt-1">Gestiona tu cuenta y sincronización.</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-5">
            <div className="h-16 w-16 rounded-full bg-indigo-100 flex items-center justify-center">
              <span className="text-indigo-700 font-bold text-xl">{initials || 'US'}</span>
            </div>
            <div className="flex-1">
              {/* Username row */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <div className="text-sm text-gray-500">Nombre de usuario</div>
                  {!editing ? (
                    <div className="flex items-center gap-3">
                      <h2 className="text-xl font-semibold text-gray-900 break-all">{user?.username || 'Usuario'}</h2>
                      <button
                        type="button"
                        onClick={startEdit}
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
                      >
                        <FaEdit className="h-4 w-4" />
                        Editar
                      </button>
                    </div>
                  ) : (
                    <div className="w-full max-w-md">
                      <label htmlFor="username" className="sr-only">Nuevo nombre de usuario</label>
                      <input
                        id="username"
                        type="text"
                        value={newUsername}
                        onChange={(e) => {
                          setNewUsername(e.target.value);
                          if (errorMsg) setErrorMsg('');
                        }}
                        className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600"
                        placeholder="Ingresa tu nuevo nombre de usuario"
                        autoFocus
                      />
                      {errorMsg ? (
                        <p className="mt-2 text-sm text-red-600">{errorMsg}</p>
                      ) : (
                        <p className="mt-2 text-xs text-gray-500">Entre 3 y 30 caracteres. Letras, números, espacios, guion y guion bajo.</p>
                      )}
                      <div className="mt-3 flex items-center gap-2">
                        <button
                          type="button"
                          onClick={saveUsername}
                          disabled={saving}
                          className={`inline-flex items-center gap-2 button text-white font-semibold
                            ${saving ? 'bg-indigo-300 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'}`}
                        >
                          <FaCheck className="h-4 w-4" />
                          {saving ? 'Guardando…' : 'Guardar'}
                        </button>
                        <button
                          type="button"
                          onClick={cancelEdit}
                          disabled={saving}
                          className="inline-flex items-center gap-2 button font-semibold border border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
                        >
                          <FaTimes className="h-4 w-4" />
                          Cancelar
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div className="text-gray-500">
                  <span className="font-medium text-gray-700">Correo:</span>{' '}
                  {user?.email}
                </div>
                <div className="text-gray-500">
                  <span className="font-medium text-gray-700">Inicio de sesión:</span>{' '}
                  {user?.login_at ? dayjs(user.login_at).locale('es').format('DD/MM/YYYY HH:mm') : '—'}
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <button
              type="button"
              className="w-full inline-flex items-center justify-center button font-semibold border-indigo-200 text-indigo-700 bg-indigo-50 hover:bg-indigo-100"
              onClick={() => {
                // TODO: Abrir flujo para cambiar contraseña (modal o ruta)
                navigate('/password/start');
              }}
            >
              Cambiar contraseña
            </button>

            <button
              type="button"
              className="w-full inline-flex items-center justify-center button font-semibold text-white bg-indigo-600 hover:bg-indigo-700"
              onClick={() => {
                // TODO: Iniciar sincronización (por ejemplo navigate('/loading'))
                navigate('/sync-changes');
              }}
            >
              Sincronizar con el servidor
            </button>

            <button
              type="button"
              onClick={handleLogout}
              disabled={loggingOut}
              className={`w-full inline-flex items-center justify-center button font-semibold
                ${loggingOut ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'}`}
            >
              {loggingOut ? 'Cerrando sesión…' : 'Cerrar sesión'}
            </button>
          </div>
        </div>

        {/* Info blocks */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="text-lg font-semibold text-gray-900">Sincronización</h3>
            <p className="text-sm text-gray-600 mt-1">
              La sincronización descarga tus carpetas, equipos, partidos, jugadores y eventos desde el servidor a tu dispositivo.
            </p>
            <div className="mt-3 text-sm">
              <span className="text-gray-500">Última sincronización:</span>{' '}
              <span className="font-medium text-gray-800">
                {lastSyncAt ? dayjs(lastSyncAt).locale('es').format('DD/MM/YYYY HH:mm') : 'No disponible'}
              </span>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="text-lg font-semibold text-gray-900">Seguridad</h3>
            <p className="text-sm text-gray-600 mt-1">
              Mantén tus credenciales seguras. Puedes actualizar tu contraseña cuando lo necesites.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}