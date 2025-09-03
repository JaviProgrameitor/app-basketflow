import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

export default function LoadingSync() {
  const navigate = useNavigate();
  const [status, setStatus] = useState('Preparando sincronización…');
  const [details, setDetails] = useState('');
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');
  const [running, setRunning] = useState(false);

  const doSync = async () => {
    try {
      setRunning(true);
      setError('');
      setDone(false);
      setStatus('Sincronizando tus datos…');
      setDetails('Descargando datos desde el servidor y guardando en tu dispositivo.');

      const result = await window.electron.bootstrapSync();

      setStatus('Completado');
      setDetails(
        `Se importaron ${result.pulledTotal} registros. Última sincronización: ${new Date(result.lastSyncAt).toLocaleString()}`
      );
      setDone(true);
    } catch (err) {
      setError('Ocurrió un error durante la sincronización.');
      setStatus('Error');
      setDetails('Intenta nuevamente o verifica tu conexión.');
    } finally {
      setRunning(false);
    }
  };

  useEffect(() => {
    doSync();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="flex flex-col items-center text-center">
            <div className="relative">
              {!done && !error ? (
                <div className="h-14 w-14 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin" />
              ) : error ? (
                <div className="h-14 w-14 rounded-full bg-red-100 flex items-center justify-center">
                  <svg className="h-7 w-7 text-red-600" viewBox="0 0 24 24" fill="none">
                    <path d="M12 9v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              ) : (
                <div className="h-14 w-14 rounded-full bg-green-100 flex items-center justify-center">
                  <svg className="h-7 w-7 text-green-600" viewBox="0 0 24 24" fill="none">
                    <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              )}
            </div>

            <h1 className="mt-5 text-2xl font-bold text-gray-800">{status}</h1>
            <p className="mt-2 text-sm text-gray-600">{details}</p>

            {error ? (
              <div className="mt-4 w-full">
                <div className="p-3 rounded-md border border-red-200 bg-red-50 text-red-700 text-sm mb-3">
                  {error}
                </div>
                <button
                  onClick={doSync}
                  disabled={running}
                  className={`w-full inline-flex items-center justify-center px-4 py-2.5 rounded-md text-white font-semibold shadow-sm transition
                    ${running ? 'bg-indigo-300 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'}`}
                >
                  {running ? 'Reintentando…' : 'Intentar de nuevo'}
                </button>
              </div>
            ) : null}

            <div className="mt-6 w-full">
              <button
                onClick={() => navigate('/folders')}
                disabled={!done}
                className={`w-full inline-flex items-center justify-center px-4 py-2.5 rounded-md text-white font-semibold shadow-sm transition
                  ${done ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-indigo-300 cursor-not-allowed'}`}
              >
                Ir a Mis Carpetas
              </button>
              {!done && !error && (
                <p className="mt-3 text-[11px] text-gray-500">
                  No cierres la aplicación mientras sincronizamos tus datos.
                </p>
              )}
            </div>
          </div>

          <div className="mt-6">
            <div className="w-full bg-gray-100 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all ${done ? 'bg-green-500 w-full' : error ? 'bg-red-500 w-2/3' : 'bg-indigo-600 animate-pulse w-3/4'}`}
              />
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 mt-4">
          BasketFlow • Sincronización segura con el servidor
        </p>
      </div>
    </div>
  );
}