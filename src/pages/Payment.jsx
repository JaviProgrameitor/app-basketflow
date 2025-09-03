import React from 'react';
import PaymentMethodSelector from '../components/form/PaymentMethodSelector.jsx';

const Payment = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-2xl">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-gray-800">Activar licencia</h1>
          <p className="mt-2 text-gray-600">
            Completa los datos del pago para activar tu licencia.
          </p>
        </div>
        <PaymentMethodSelector />
      </div>
    </div>
  );
};

export default Payment;