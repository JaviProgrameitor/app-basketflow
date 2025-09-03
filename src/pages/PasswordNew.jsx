import React, { useEffect, useState } from 'react';
import { FaArrowCircleLeft } from 'react-icons/fa';
import { Link, useLocation, useNavigate } from 'react-router';
import { Toaster, toast } from 'sonner';

export default function PasswordNew() {
  const navigate = useNavigate();
  const location = useLocation();
  const reset_token = location.state?.reset_token || '';

  const [p1, setP1] = useState('');
  const [p2, setP2] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!reset_token) {
      navigate('/password/start');
    }
  }, [reset_token, navigate]);

  const validate = () => {
    if (p1.length < 8) return 'La contraseña debe tener al menos 8 caracteres.';
    if (!/[A-Z]/.test(p1) || !/[a-z]/.test(p1) || !/\d/.test(p1)) return 'Usa mayúsculas, minúsculas y números.';
    if (p1 !== p2) return 'Las contraseñas no coinciden.';
    return '';
    // Ajusta reglas según tu política
  };

  const submit = async (e) => {
    e.preventDefault();
    const err = validate();
    if (err) {
      toast.error(err);
      return;
    }
    try {
      setSaving(true);
      await window.electron.resetPassword(reset_token, p1);
      toast.success('Contraseña actualizada. Inicia sesión nuevamente.');
      await new Promise(r => setTimeout(r, 600));
      // Por seguridad, cerrar sesión local si existe
      try { await window.electron.logout(); } catch {}
      navigate('/login');
    } catch (e) {
      toast.error(e?.message || 'No se pudo actualizar la contraseña');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6 relative">
      <Toaster position="top-center" richColors />
      <Link to="/password/start" className="absolute top-6 left-8 flex items-center hover:text-indigo-600 lg:top-8 lg:text-xl">
        <FaArrowCircleLeft className="h-5 w-5 mr-2" />
        Regresar
      </Link>
      <div className="w-full max-w-md bg-white rounded-xl border border-gray-200 shadow-sm p-8">
        <h1 className="text-2xl font-bold text-gray-900">Nueva contraseña</h1>
        <p className="mt-1 text-gray-600 text-sm">Crea una nueva contraseña segura para tu cuenta.</p>

        <form onSubmit={submit} className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Contraseña</label>
            <input
              type="password"
              value={p1}
              onChange={(e) => setP1(e.target.value)}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600"
              placeholder="••••••••"
              required
            />
            <p className="mt-1 text-xs text-gray-500">Mínimo 8 caracteres, incluye mayúsculas, minúsculas y números.</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Repetir contraseña</label>
            <input
              type="password"
              value={p2}
              onChange={(e) => setP2(e.target.value)}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className={`w-full inline-flex items-center justify-center px-4 py-2.5 rounded-md text-white font-semibold shadow-sm transition
              ${saving ? 'bg-indigo-300 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'}`}
          >
            {saving ? 'Guardando…' : 'Actualizar contraseña'}
          </button>
        </form>
      </div>
    </div>
  );
}