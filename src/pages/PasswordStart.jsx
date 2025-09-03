import React, { useEffect, useState } from 'react';
import { FaArrowCircleLeft } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router';
import { Toaster, toast } from 'sonner';

export default function PasswordStart() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    let canceled = false;
    async function load() {
      try {
        const session = await window.electron.getActiveSession();
        if (canceled) return;
        // Prefill y bloquear si hay sesión
        if (session?.email) {
          setEmail(session.email);
        }
      } catch { }
    }
    load();
    return () => { canceled = true; };
  }, []);

  const requestCode = async (e) => {
    e.preventDefault();
    try {
      if (!email) return;
      setSending(true);
      await window.electron.requestPasswordReset(email);
      toast.success('Código enviado a tu correo.');
      navigate('/password/verify', { state: { email } });
    } catch (err) {
      toast.error(err?.message || 'No se pudo enviar el código');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-6 relative">
      <Toaster position="top-center" richColors />
      <Link to="/profile-user" className="absolute top-6 left-8 flex items-center hover:text-indigo-600 lg:top-8 lg:text-xl">
        <FaArrowCircleLeft className="h-5 w-5 mr-2" />
        Volver a mi Perfil
      </Link>
      <div className="w-full max-w-md bg-white rounded-xl border border-gray-200 shadow-sm p-8">
        <h1 className="text-2xl font-bold text-gray-900">Cambiar contraseña</h1>
        <p className="mt-1 text-gray-600 text-sm">
          Te enviaremos un código de verificación a tu correo para continuar.
        </p>

        <form onSubmit={requestCode} className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Correo electrónico</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600"
              placeholder="tu@email.com"
              required
            />
            <p className="mt-1 text-xs text-gray-500">Usa el correo vinculado a tu cuenta.</p>
          </div>

          <button
            type="submit"
            disabled={sending}
            className={`w-full inline-flex items-center justify-center px-4 py-2.5 rounded-md text-white font-semibold shadow-sm transition
              ${sending ? 'bg-indigo-300 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'}`}
          >
            {sending ? 'Enviando…' : 'Enviar código'}
          </button>
        </form>
      </div>
    </div>
  );
}