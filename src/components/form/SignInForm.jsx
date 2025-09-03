
import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import Input from './Input.jsx';
import Spinner from '../common/Spinner.jsx';

const SignInForm = (props) => {
  const { setError } = props;
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const result = await window.electron.login({ email, password });
    if (result.ok) {
      setIsLoading(false);
      navigate('/loading');
    } else {
      console.log(result)
      setError(result.error);
      setIsLoading(false);
    }
  };

  return (
    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
      <input type="hidden" name="remember" value="true" />
      <div className="rounded-md shadow-sm space-y-4">
        <Input 
          title="Correo electrónico"
          name="email"
          type="email"
          value={email}
          setValue={setEmail}
          placeholder="tu@email.com"
        />

        <Input 
          title="Contraseña"
          name="password"
          type="password"
          value={password}
          setValue={setPassword}
          placeholder="••••••••"
        />
      </div>

      <div className="flex justify-center">

        <div className="text-sm">
          <a
            href="/forgot-password"
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            ¿Olvidaste tu contraseña?
          </a>
        </div>
      </div>

      <div>
        <button
          type="submit"
          disabled={isLoading}
          className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
            isLoading ? 'opacity-75 cursor-not-allowed' : ''
          }`}
        >
          {isLoading ? (
            <>
              <Spinner />
              Procesando...
            </>
          ) : (
            'Iniciar sesión'
          )}
        </button>
      </div>
    </form>
  )
}

export default SignInForm