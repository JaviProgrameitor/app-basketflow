
import React, { useState } from 'react';
import SignInForm from '../components/form/SignInForm.jsx';
import ErrorMessageSignIn from '../components/form/ErrorMessageSignIn.jsx';
import HeaderSignIngForm from '../components/form/HeaderSignIngForm.jsx';

const Login = () => {
  const [error, setError] = useState('');

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <HeaderSignIngForm/>

        {error && <ErrorMessageSignIn error={error} />}

        <SignInForm setError={setError} />
      </div>
    </div>
  );
};

export default Login;