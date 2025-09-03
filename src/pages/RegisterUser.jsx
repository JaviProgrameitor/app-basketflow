
import React, { useState } from 'react'
import { Link } from 'react-router';

import RegisterUserForm from '../components/form/RegisterUserForm.jsx';
import ErrorMessageSignIn from '../components/form/ErrorMessageSignIn.jsx';

const RegisterUser = () => {
  const [error, setError] = useState('');

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Crear cuenta
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            O{' '}
            <Link
              to="/login"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              inicia sesión
            </Link>
          </p>
        </div>

        {error && <ErrorMessageSignIn error={error} />}

        <RegisterUserForm setError={setError} />

      </div>
    </div>
  )
}

export default RegisterUser