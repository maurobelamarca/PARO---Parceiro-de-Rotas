
import React, { useState } from 'react';
import { Driver, RideRequest, PricingConfig } from '../types';
import { Card } from './common/Card';
import { Button } from './common/Button';

interface DriverHomeScreenProps {
  driver: Driver;
  onToggleOnline: (isOnline: boolean) => void;
  rideRequest: RideRequest | null;
  onAcceptOffer: (fare: number) => void;
  pricingConfig: PricingConfig;
}

export const DriverHomeScreen: React.FC<DriverHomeScreenProps> = ({ driver, onToggleOnline, rideRequest, onAcceptOffer, pricingConfig }) => {
  const [proposedFare, setProposedFare] = useState<number | null>(null);

  const calculateFare = (request: RideRequest) => {
    // Super simplified fare estimation for driver
    const distance = Math.random() * 15 + 2;
    const driverDistance = Math.random() * 3 + 1; // Distance to pickup
    const totalDistance = distance + driverDistance;
    const rate = request.vehicleType === 'Carro' ? pricingConfig.carMinKmRate : pricingConfig.motoMinKmRate;
    const minFare = request.vehicleType === 'Carro' ? pricingConfig.carMinFare : pricingConfig.motoMinFare;
    const fare = Math.max(totalDistance * rate, minFare);
    return fare;
  }
  
  const initialFare = rideRequest ? calculateFare(rideRequest) : 0;
  
  const handleAccept = () => {
    onAcceptOffer(proposedFare || initialFare);
    setProposedFare(null);
  };
  
  return (
    <div className="p-4 md:p-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Olá, {driver.name}</h1>
          <p className="text-gray-600">Pronto para novas rotas?</p>
        </div>
        <div className="flex items-center space-x-2">
            <span className={`text-sm font-medium ${driver.isOnline ? 'text-green-600' : 'text-gray-500'}`}>
                {driver.isOnline ? 'Online' : 'Offline'}
            </span>
            <label htmlFor="toggle" className="flex items-center cursor-pointer">
                <div className="relative">
                    <input id="toggle" type="checkbox" className="sr-only" checked={driver.isOnline} onChange={(e) => onToggleOnline(e.target.checked)} />
                    <div className="w-10 h-4 bg-gray-400 rounded-full shadow-inner"></div>
                    <div className={`dot absolute w-6 h-6 bg-white rounded-full shadow -left-1 -top-1 transition ${driver.isOnline ? 'translate-x-full bg-primary' : ''}`}></div>
                </div>
            </label>
        </div>
      </div>

      <Card>
        {driver.isOnline && !rideRequest && (
            <div className="text-center py-10">
                <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                <h2 className="mt-4 text-xl font-semibold text-gray-700">Aguardando solicitações...</h2>
                <p className="mt-1 text-gray-500">Você será notificado quando uma nova rota estiver disponível.</p>
            </div>
        )}
        {!driver.isOnline && (
             <div className="text-center py-10">
                <h2 className="text-xl font-semibold text-gray-700">Você está offline</h2>
                <p className="mt-1 text-gray-500">Fique online para começar a receber solicitações de rota.</p>
            </div>
        )}
        {driver.isOnline && rideRequest && (
            <div>
                <h2 className="text-2xl font-semibold mb-4 text-gray-700">Nova Solicitação de Rota!</h2>
                <div className="p-4 border rounded-lg space-y-3">
                    <div className="flex justify-between">
                        <span className="font-semibold">Passageiro:</span>
                        <span>{rideRequest.passenger.name} (Nível {rideRequest.passenger.profileLevel})</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="font-semibold">Partida:</span>
                        <span className="text-right">{rideRequest.from.address}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="font-semibold">Destino:</span>
                        <span className="text-right">{rideRequest.to.address}</span>
                    </div>
                     <div className="flex justify-between text-lg font-bold bg-green-100 p-2 rounded">
                        <span className="text-green-800">Valor Sugerido:</span>
                        <span className="text-green-800">R$ {initialFare.toFixed(2)}</span>
                    </div>
                </div>

                <div className="mt-4 space-y-4">
                    <div>
                        <label htmlFor="fare" className="block text-sm font-medium text-gray-700 mb-1">Aumentar valor (opcional)</label>
                        <input 
                            type="number" 
                            id="fare"
                            placeholder={initialFare.toFixed(2)}
                            onChange={(e) => setProposedFare(Number(e.target.value))}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                        />
                    </div>
                    <Button onClick={handleAccept} variant="success">
                        {proposedFare ? `Enviar Proposta de R$ ${proposedFare.toFixed(2)}` : `Aceitar Rota por R$ ${initialFare.toFixed(2)}`}
                    </Button>
                    <Button variant="danger">Recusar</Button>
                </div>
            </div>
        )}
      </Card>
    </div>
  );
};
