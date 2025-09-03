import React, { useEffect, useRef, useState } from 'react';
import { FaArrowCircleLeft } from 'react-icons/fa';
import { Link, useLocation, useNavigate } from 'react-router';
import { Toaster, toast } from 'sonner';

const CODE_LENGTH = 6;

export default function PasswordVerifyCode() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || '';
  const [values, setValues] = useState(Array(CODE_LENGTH).fill(''));
  const [verifying, setVerifying] = useState(false);
  const inputsRef = useRef([]);

  useEffect(() => {
    if (!email) {
      navigate('/password/start');
      return;
    }
    // Focus primer input
    inputsRef.current[0]?.focus();
  }, [email, navigate]);

  const handleChange = (idx, val) => {
    const digit = val.replace(/\D/g, '').slice(0, 1);
    const newValues = [...values];
    newValues[idx] = digit;
    setValues(newValues);

    if (digit && idx < CODE_LENGTH - 1) {
      inputsRef.current[idx + 1]?.focus();
    }
  };

  const handleKeyDown = (idx, e) => {
    if (e.key === 'Backspace' && !values[idx] && idx > 0) {
      inputsRef.current[idx - 1]?.focus();
    }
    if ((e.key === 'ArrowLeft') && idx > 0) {
      inputsRef.current[idx - 1]?.focus();
    }
    if ((e.key === 'ArrowRight') && idx < CODE_LENGTH - 1) {
      inputsRef.current[idx + 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    const paste = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, CODE_LENGTH);
    if (!paste) return;
    const newValues = Array(CODE_LENGTH).fill('');
    for (let i = 0; i < paste.length; i++) newValues[i] = paste[i];
    setValues(newValues);
    const nextIndex = Math.min(paste.length, CODE_LENGTH - 1);
    setTimeout(() => inputsRef.current[nextIndex]?.focus(), 0);
  };

  const submit = async (e) => {
    e.preventDefault();
    const code = values.join('');
    if (code.length !== CODE_LENGTH) {
      toast.error('Completa el código de 6 dígitos');
      return;
    }
    try {
      setVerifying(true);
      const { reset_token } = await window.electron.verifyPasswordResetCode(email, code);
      toast.success('Código verificado');
      navigate('/password/new', { state: { reset_token } });
    } catch (err) {
      toast.error(err?.message || 'Código inválido o expirado');
    } finally {
      setVerifying(false);
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
        <h1 className="text-2xl font-bold text-gray-900">Verifica tu código</h1>
        <p className="mt-1 text-gray-600 text-sm">
          Ingresa el código de 6 dígitos que enviamos a <span className="font-medium">{email}</span>
        </p>

        <form onSubmit={submit} className="mt-6">
          <div
            className="flex justify-between gap-2"
            onPaste={handlePaste}
          >
            {values.map((v, idx) => (
              <input
                key={idx}
                ref={(el) => (inputsRef.current[idx] = el)}
                type="text"
                inputMode="numeric"
                pattern="\d*"
                maxLength={1}
                value={v}
                onChange={(e) => handleChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                className="w-12 h-12 text-center text-lg font-semibold rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600"
                aria-label={`Dígito ${idx + 1}`}
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={verifying}
            className={`mt-6 w-full inline-flex items-center justify-center px-4 py-2.5 rounded-md text-white font-semibold shadow-sm transition
              ${verifying ? 'bg-indigo-300 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'}`}
          >
            {verifying ? 'Verificando…' : 'Continuar'}
          </button>

          <button
            type="button"
            onClick={() => navigate('/password/start', { state: { email } })}
            className="mt-3 w-full inline-flex items-center justify-center px-4 py-2.5 rounded-md font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200"
          >
            Reenviar código
          </button>
        </form>
      </div>
    </div>
  );
}