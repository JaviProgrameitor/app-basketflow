
import React from 'react';
import { Link } from 'react-router';

const HeaderSignIngForm = () => {
  return (
    <div className="text-center">
    <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
      Iniciar sesión
    </h2>
    <p className="mt-2 text-sm text-gray-600">
      O{' '}
      <Link
        to="/register"
        className="font-medium text-indigo-600 hover:text-indigo-500"
      >
        crea una cuenta nueva
      </Link>
    </p>
  </div>
  )
}

export default HeaderSignIngForm;