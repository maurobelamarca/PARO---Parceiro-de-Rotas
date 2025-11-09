
import React, { useState } from 'react';
import { Button } from './common/Button';
import { Input } from './common/Input';
import { Card } from './common/Card';
import { MOCK_PASSENGERS, MOCK_DRIVERS, MOCK_ADMIN_ID } from '../constants';
import { User, UserRole } from '../types';

interface LoginScreenProps {
  onLogin: (user: User) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');

  const handleSendCode = () => {
    if (phone.length < 10) {
      setError('Por favor, insira um número de telefone válido.');
      return;
    }
    setError('');
    console.log(`Sending code to ${phone} via WhatsApp (simulated).`);
    setStep(2);
  };

  const handleLogin = () => {
    // This is a simulation. Any code is accepted.
    // In a real app, you would validate the code.
    if (code.length < 4) {
      setError('Código de confirmação inválido.');
      return;
    }

    // Simulate finding a user by phone number
    const passenger = MOCK_PASSENGERS.find(p => p.phone === phone);
    const driver = MOCK_DRIVERS.find(d => d.phone === phone);

    if (passenger) {
      onLogin(passenger);
    } else if (driver) {
      onLogin(driver);
    } else if (phone === '00000000000') { // Admin login
      onLogin({
        id: MOCK_ADMIN_ID,
        name: 'Admin',
        phone: '00000000000',
        role: UserRole.ADMIN,
        rating: 5,
        profileLevel: 3,
      });
    }
    else {
      // Simulate new user registration
      const newUser = {
        id: `user_${Date.now()}`,
        name: 'Novo Usuário',
        phone: phone,
        role: UserRole.PASSENGER,
        rating: 5.0,
        profileLevel: 1,
        location: { lat: -23.5505, lng: -46.6333 },
      };
      onLogin(newUser);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md space-y-6">
        <div className="text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-auto text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          <h1 className="text-3xl font-bold text-gray-900">Bem-vindo à Rota Parceira</h1>
          <p className="mt-2 text-gray-600">Sua rede social de caronas.</p>
        </div>
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        {step === 1 && (
          <div className="space-y-4">
            <Input
              label="Número de Telefone (com DDD)"
              id="phone"
              type="tel"
              placeholder="(11) 98765-4321"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>}
            />
            <Button onClick={handleSendCode}>Enviar Código</Button>
            <p className="text-xs text-gray-500 text-center">
                Para fins de demonstração, use um telefone de um motorista/passageiro mock ou crie um novo. Use `00000000000` para admin.
            </p>
          </div>
        )}
        {step === 2 && (
          <div className="space-y-4">
            <p className="text-center text-sm text-gray-600">
              Enviamos um código de confirmação para o seu WhatsApp (simulado).
            </p>
            <Input
              label="Código de Confirmação"
              id="code"
              type="text"
              placeholder="1234"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>}
            />
            <Button onClick={handleLogin}>Entrar</Button>
             <button onClick={() => setStep(1)} className="text-sm text-primary hover:underline w-full text-center">
               Mudar número
            </button>
          </div>
        )}
      </Card>
    </div>
  );
};
