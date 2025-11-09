
import React, { useState } from 'react';
// FIX: Imported RideRequestStatus to use enum members for type safety.
import { VehicleType, RideLocation, RideRequest, Passenger, PricingConfig, RideOffer, Driver, RideRequestStatus } from '../types';
import { Card } from './common/Card';
import { Input } from './common/Input';
import { Button } from './common/Button';

interface PassengerHomeScreenProps {
  passenger: Passenger;
  pricingConfig: PricingConfig;
  onCreateRideRequest: (request: RideRequest) => void;
  offers: RideOffer[];
  onAcceptOffer: (offer: RideOffer) => void;
  availableDrivers: Driver[];
}

const RideRequestModal: React.FC<{offers: RideOffer[], onAcceptOffer: (offer: RideOffer) => void, onCancel: () => void}> = ({ offers, onAcceptOffer, onCancel }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <Card className="w-full max-w-lg relative">
            <button onClick={onCancel} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <h2 className="text-2xl font-bold mb-4 text-center">Propostas de Rota</h2>
            {offers.length === 0 ? (
                <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-4 text-gray-600">Buscando parceiros de rota...</p>
                </div>
            ) : (
                <div className="space-y-4 max-h-[60vh] overflow-y-auto">
                    {offers.map(offer => (
                        <div key={offer.id} className="p-4 border rounded-lg flex items-center justify-between hover:bg-gray-50 transition">
                            <div className="flex items-center space-x-4">
                                <img src={offer.driver.profilePictureUrl} alt={offer.driver.name} className="w-14 h-14 rounded-full object-cover" />
                                <div>
                                    <p className="font-bold">{offer.driver.name} <span className="text-sm font-normal text-gray-500">({offer.driver.vehicle.model})</span></p>
                                    <p className="text-sm text-gray-600">⭐ {offer.driver.rating.toFixed(1)} | Nível {offer.driver.profileLevel}</p>
                                    <p className="text-sm text-gray-500">Chega em {offer.driverEta} min</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-lg font-bold text-accent">R$ {offer.fare.toFixed(2)}</p>
                                <Button variant="success" className="py-1 px-4 mt-1 text-sm" onClick={() => onAcceptOffer(offer)}>Aceitar</Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </Card>
    </div>
);

export const PassengerHomeScreen: React.FC<PassengerHomeScreenProps> = ({ passenger, pricingConfig, onCreateRideRequest, offers, onAcceptOffer, availableDrivers }) => {
  const [from, setFrom] = useState<string>('Minha Localização Atual');
  const [to, setTo] = useState<string>('');
  const [vehicleType, setVehicleType] = useState<VehicleType>(VehicleType.CAR);
  const [showAlert, setShowAlert] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  
  const estimateFare = () => {
    if (!to) return "0.00";
    // Super simplified fare estimation
    const distance = Math.random() * 15 + 2; // random km between 2-17
    const rate = vehicleType === VehicleType.CAR ? pricingConfig.carMinKmRate : pricingConfig.motoMinKmRate;
    const minFare = vehicleType === VehicleType.CAR ? pricingConfig.carMinFare : pricingConfig.motoMinFare;
    const fare = Math.max(distance * rate, minFare);
    return fare.toFixed(2);
  };

  const handleSearchClick = () => {
    if(!to) {
        alert("Por favor, insira um destino.");
        return;
    }
    setShowAlert(true);
  }

  const handleConfirmSearch = () => {
    setShowAlert(false);
    setIsSearching(true);
    const request: RideRequest = {
        id: `req_${Date.now()}`,
        passenger,
        from: { address: from, lat: passenger.location.lat, lng: passenger.location.lng },
        to: { address: to, lat: passenger.location.lat + 0.05, lng: passenger.location.lng + 0.05 }, // Mock destination
        vehicleType,
        // FIX: Used RideRequestStatus.SEARCHING enum member instead of a string literal.
        status: RideRequestStatus.SEARCHING,
        createdAt: Date.now()
    }
    onCreateRideRequest(request);
  }
  
  const handleCancelSearch = () => {
    setIsSearching(false);
    // Optionally inform the parent component to cancel the request
  }


  return (
    <div className="h-screen w-screen flex flex-col">
      {isSearching && <RideRequestModal offers={offers} onAcceptOffer={onAcceptOffer} onCancel={handleCancelSearch} />}
      {showAlert && (
         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md text-center">
                <h3 className="text-lg font-bold text-red-600 mb-2">Alerta!</h3>
                <p className="text-sm text-gray-700 mb-4">Ao buscar rota você deve estar no ponto de partida esperando o motorista. Se você não estiver, o motorista não poderá esperar e você receberá uma avaliação negativa.</p>
                <p className="text-xs text-gray-500 mb-6">Você poderá ficar 5 minutos sem conseguir buscar corridas se não estiver no embarque.</p>
                <div className="flex gap-4">
                    <Button variant="secondary" onClick={() => setShowAlert(false)}>Cancelar</Button>
                    <Button variant="primary" onClick={handleConfirmSearch}>Confirmar e Buscar</Button>
                </div>
            </Card>
        </div>
      )}

      {/* Map Placeholder */}
      <div className="flex-grow bg-gray-300 flex items-center justify-center text-gray-500 relative">
        <p>Mapa</p>
         {/* User dot */}
        <div className="absolute" style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
            <span className="relative flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-primary"></span>
            </span>
        </div>
        {availableDrivers.filter(d => d.isOnline).map(driver => (
            <div key={driver.id} className="absolute text-2xl" style={{ top: `${45 + (driver.location.lat - passenger.location.lat) * 2000}%`, left: `${50 + (driver.location.lng - passenger.location.lng) * 2000}%`}}>
                {driver.vehicle.type === VehicleType.CAR ? '🚗' : '🛵'}
            </div>
        ))}
      </div>

      {/* Control Panel */}
      <div className="absolute bottom-0 left-0 right-0">
         <Card className="rounded-b-none rounded-t-2xl shadow-2xl">
            <div className="space-y-4">
                <Input label="Partida" id="from" value={from} onChange={e => setFrom(e.target.value)} disabled />
                <Input label="Destino" id="to" placeholder="Para onde vamos?" value={to} onChange={e => setTo(e.target.value)} />
                
                <div className="flex gap-4">
                    <button onClick={() => setVehicleType(VehicleType.CAR)} className={`flex-1 p-3 rounded-lg border-2 transition ${vehicleType === VehicleType.CAR ? 'border-primary bg-blue-50' : 'border-gray-300'}`}>
                       <span className="text-2xl">🚗</span>
                       <p className="font-semibold">Carro</p>
                    </button>
                    <button onClick={() => setVehicleType(VehicleType.MOTO)} className={`flex-1 p-3 rounded-lg border-2 transition ${vehicleType === VehicleType.MOTO ? 'border-primary bg-blue-50' : 'border-gray-300'}`}>
                        <span className="text-2xl">🛵</span>
                        <p className="font-semibold">Moto</p>
                    </button>
                </div>

                <div className="flex justify-between items-center bg-gray-100 p-3 rounded-lg">
                    <span className="font-semibold">Estimativa</span>
                    <span className="font-bold text-xl text-accent">R$ {estimateFare()}</span>
                </div>

                <Button onClick={handleSearchClick} disabled={!to}>Buscar Parceiro de Rota</Button>
            </div>
        </Card>
      </div>

    </div>
  );
};
