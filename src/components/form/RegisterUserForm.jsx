
import React, { useState } from "react"
import { useNavigate } from 'react-router';
import Input from './Input.jsx';
import Spinner from '../common/Spinner.jsx';

const RegisterUserForm = ({setError}) => {
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!username || !email || !password) {
      setError('Por favor completa todos los campos');
      setIsLoading(false);
      return;
    }

    const result = await window.electron.registerUser({ email, password, username });
    if (result.ok) {
      setIsLoading(false);
      navigate('/folders');
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
          title="Nombre Usuario"
          name="username"
          type="text"
          value={username}
          setValue={setUsername}
          
          placeholder="Tu nombre de usuario"
        />

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
          minLength={6}
          placeholder="••••••••"
        />
      </div>

      <div>
        <button
          type="submit"
          disabled={isLoading}
          className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${isLoading ? 'opacity-75 cursor-not-allowed' : ''
            }`}
        >
          {isLoading ? (
            <>
              <Spinner />
              Procesando...
            </>
          ) : (
            'Crear cuenta'
          )}
        </button>
      </div>
    </form>
  )
}

export default RegisterUserForm