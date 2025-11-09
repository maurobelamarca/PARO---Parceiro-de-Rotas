
import React, { useState, useEffect } from 'react';
import { Ride, UserRole, RideStatus } from '../types';
import { Card } from './common/Card';
import { Button } from './common/Button';

interface RideInProgressScreenProps {
  ride: Ride;
  currentUserRole: UserRole;
  onUpdateRideStatus: (status: RideStatus) => void;
  onCancelRide: () => void;
}

const statusMessages = {
    [UserRole.PASSENGER]: {
        [RideStatus.ACCEPTED]: "Seu parceiro de rota está a caminho!",
        [RideStatus.DRIVER_ARRIVING]: "Seu parceiro de rota está a caminho!",
        [RideStatus.IN_PROGRESS]: "Você está a caminho do seu destino.",
        [RideStatus.COMPLETED]: "Corrida finalizada! Obrigado por usar a Rota Parceira.",
    },
    [UserRole.DRIVER]: {
        [RideStatus.ACCEPTED]: "Você aceitou a rota. Dirija-se ao ponto de partida.",
        [RideStatus.DRIVER_ARRIVING]: "Você está a caminho do passageiro.",
        [RideStatus.IN_PROGRESS]: "Corrida em andamento.",
        [RideStatus.COMPLETED]: "Corrida finalizada com sucesso!",
    }
}


export const RideInProgressScreen: React.FC<RideInProgressScreenProps> = ({ ride, currentUserRole, onUpdateRideStatus, onCancelRide }) => {
  const [eta, setEta] = useState(10);
  const otherUser = currentUserRole === UserRole.PASSENGER ? ride.driver : ride.passenger;

  useEffect(() => {
    const timer = setInterval(() => {
      setEta(prev => (prev > 1 ? prev - 1 : 0));
    }, 1000 * 60); // decrement every minute
    return () => clearInterval(timer);
  }, [ride.status]);
  
  const getNextAction = () => {
      if (currentUserRole === UserRole.DRIVER) {
          switch (ride.status) {
              case RideStatus.ACCEPTED:
              case RideStatus.DRIVER_ARRIVING:
                  return <Button onClick={() => onUpdateRideStatus(RideStatus.IN_PROGRESS)} variant="primary">Iniciar Corrida</Button>
              case RideStatus.IN_PROGRESS:
                  return <Button onClick={() => onUpdateRideStatus(RideStatus.COMPLETED)} variant="success">Finalizar Corrida</Button>
          }
      }
      return null;
  }

  const message = statusMessages[currentUserRole]?.[ride.status] || "Status desconhecido";
  const partnerRole = currentUserRole === UserRole.PASSENGER ? 'Motorista' : 'Passageiro';

  return (
    <div className="h-screen w-screen flex flex-col">
       {/* Map Placeholder */}
      <div className="flex-grow bg-gray-300 flex items-center justify-center text-gray-500 relative">
        <p>Mapa em tempo real</p>
        <div className="absolute top-1/3 left-1/3 text-4xl">👤</div>
        <div className="absolute top-2/3 left-2/3 text-4xl">{ride.driver.vehicle.type === 'Carro' ? '🚗' : '🛵'}</div>
        <div className="absolute top-1/2 left-1/2 w-px h-1/3 bg-gray-500 transform -rotate-45"></div>
      </div>

      <div className="absolute bottom-0 left-0 right-0">
          <Card className="rounded-b-none rounded-t-2xl shadow-2xl">
            <div className="text-center mb-4">
                <h2 className="text-xl font-bold">{message}</h2>
                <p className="text-gray-600">Tempo estimado: {eta} minutos</p>
            </div>

            <div className="p-4 border rounded-lg mb-4">
                <div className="flex items-center space-x-4">
                    <img src={otherUser.profilePictureUrl} alt={otherUser.name} className="w-16 h-16 rounded-full object-cover"/>
                    <div>
                        <p className="font-bold text-lg">{partnerRole}: {otherUser.name}</p>
                        <p className="text-gray-600">⭐ {otherUser.rating.toFixed(1)} | Nível {otherUser.profileLevel}</p>
                        {currentUserRole === UserRole.PASSENGER && <p className="text-sm text-gray-500">{ride.driver.vehicle.model} - {ride.driver.vehicle.plate}</p>}
                    </div>
                </div>
            </div>
            
            <div className="space-y-2">
                {getNextAction()}
                {ride.status !== RideStatus.COMPLETED &&
                    <Button onClick={onCancelRide} variant="danger">Cancelar Rota</Button>
                }
            </div>
          </Card>
      </div>
    </div>
  );
};
