import React, { useState } from 'react';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useNavigate } from 'react-router';

const stripePromise = loadStripe('pk_live_51OmqVXAqlpFzwi6zfllmvQMAYPVspYQsY0MMt0Eay2stbrgKEfpD4TYLbTxkeRU3cuZw3kl3nTSp2Ffu5atpjCUz002sPaOMur');

function PaymentForm() {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!stripe || !elements) return;

    if (!name.trim()) {
      setErrorMsg('Por favor, ingresa el nombre del titular de la tarjeta.');
      return;
    }
    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email)) {
      setErrorMsg('Por favor, ingresa un correo electrónico válido.');
      return;
    }

    setIsProcessing(true);
    try {
      const card = elements.getElement(CardElement);
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card,
        billing_details: {
          name: name.trim(),
          email: email.trim(),
        },
      });

      if (error) {
        setErrorMsg(error.message || 'No fue posible crear el método de pago.');
        return;
      }

      // Llama a tu backend vía IPC para crear el pago
      await window.electron.createPayment(paymentMethod.id);

      // Crea la licencia vía IPC 
      const newLicense = await window.electron.createLicense();
      if(!newLicense.ok) {
        throw new Error('Ocurrió un error al procesar el pago.');
      }

      setSuccessMsg('Pago realizado y licencia activada correctamente.');
      // Redirige después de un breve delay
      setTimeout(() => navigate('/folders'), 800);
    } catch (err) {
      setErrorMsg(err?.message || 'Ocurrió un error al procesar el pago.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-1">Detalles de pago</h2>
      <p className="text-sm text-gray-600 mb-6">
        Tus datos están protegidos. Procesamos pagos de forma segura con Stripe.
      </p>

      <div className="grid grid-cols-1 gap-4">
        <div>
          <label htmlFor="cardholder" className="block text-sm font-medium text-gray-700 mb-1">
            Nombre del titular
          </label>
          <input
            id="cardholder"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="cc-name"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600"
            placeholder="Ej. Juan Pérez"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Correo electrónico
          </label>
          <input
            id="email"
            type="email"
            value={email}
            autoComplete="email"
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600"
            placeholder="tucorreo@dominio.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Datos de la tarjeta
          </label>
          <div className="w-full rounded-md border border-gray-300 px-3 py-3 bg-white focus-within:ring-2 focus-within:ring-indigo-600 focus-within:border-indigo-600 transition">
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: '16px',
                    color: '#1f2937', // gray-800
                    '::placeholder': { color: '#9ca3af' }, // gray-400
                    fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, Helvetica Neue, Arial, "Apple Color Emoji","Segoe UI Emoji"',
                  },
                  invalid: { color: '#dc2626' }, // red-600
                },
                hidePostalCode: true,
              }}
            />
          </div>
          <p className="mt-1 text-xs text-gray-500">Se aceptan tarjetas de crédito y débito.</p>
        </div>
      </div>

      {errorMsg ? (
        <div className="mt-4 p-3 rounded-md border border-red-200 bg-red-50 text-red-700 text-sm">
          {errorMsg}
        </div>
      ) : null}
      {successMsg ? (
        <div className="mt-4 p-3 rounded-md border border-green-200 bg-green-50 text-green-700 text-sm">
          {successMsg}
        </div>
      ) : null}

      <div className="mt-6 flex items-center justify-end gap-3">
        <button
          type="submit"
          disabled={!stripe || isProcessing}
          className={`inline-flex items-center px-5 py-2.5 rounded-md text-white font-semibold shadow-sm transition
            ${isProcessing ? 'bg-indigo-300' : 'bg-indigo-600 hover:bg-indigo-700'}
            ${!stripe || isProcessing ? 'opacity-80 cursor-not-allowed' : ''}`}
        >
          {isProcessing ? 'Procesando…' : 'Pagar y activar licencia'}
        </button>
      </div>

      <p className="mt-3 text-[11px] text-gray-500 text-right">
        Procesado por Stripe. No almacenamos datos sensibles de tu tarjeta.
      </p>
    </form>
  );
}

export default function PaymentMethodSelector() {
  return (
    <Elements stripe={stripePromise}>
      <PaymentForm />
    </Elements>
  );
}