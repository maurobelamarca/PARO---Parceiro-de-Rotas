
import React, { useState, useEffect } from 'react';
import { 
  User, UserRole, Driver, Passenger, PricingConfig, RideRequest, 
  RideOffer, Ride, RideStatus 
} from './types';
import { AppView, MOCK_DRIVERS, MOCK_PASSENGERS, DEFAULT_PRICING } from './constants';
import { LoginScreen } from './components/LoginScreen';
import { AdminPanel } from './components/AdminPanel';
import { PassengerHomeScreen } from './components/PassengerHomeScreen';
import { DriverHomeScreen } from './components/DriverHomeScreen';
import { RideInProgressScreen } from './components/RideInProgressScreen';

const Header: React.FC<{user: User | null; onLogout: () => void; setView: (view: AppView) => void}> = ({user, onLogout, setView}) => {
    if (!user) return null;

    const getHomeView = () => {
        switch(user.role) {
            case UserRole.PASSENGER: return AppView.PASSENGER_HOME;
            case UserRole.DRIVER: return AppView.DRIVER_HOME;
            case UserRole.ADMIN: return AppView.ADMIN_PANEL;
            default: return AppView.LOGIN;
        }
    }

    return (
        <header className="bg-white shadow-md p-4 flex justify-between items-center z-10">
            <h1 className="text-xl font-bold text-primary cursor-pointer" onClick={() => setView(getHomeView())}>Rota Parceira</h1>
            <div className="flex items-center space-x-4">
                <span className="font-semibold">{user.name}</span>
                <button onClick={onLogout} className="text-sm text-red-600 hover:underline">Sair</button>
            </div>
        </header>
    );
};


const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [view, setView] = useState<AppView>(AppView.LOGIN);
  
  const [pricingConfig, setPricingConfig] = useState<PricingConfig>(DEFAULT_PRICING);
  const [drivers, setDrivers] = useState<Driver[]>(MOCK_DRIVERS);
  const [passengers, setPassengers] = useState<Passenger[]>(MOCK_PASSENGERS);

  const [rideRequest, setRideRequest] = useState<RideRequest | null>(null);
  const [rideOffers, setRideOffers] = useState<RideOffer[]>([]);
  const [activeRide, setActiveRide] = useState<Ride | null>(null);

  useEffect(() => {
    if (rideRequest) {
      // Simulate drivers making offers
      const availableDrivers = drivers.filter(d => d.isOnline && d.vehicle.type === rideRequest.vehicleType);
      
      setRideOffers([]); // Clear old offers
      
      availableDrivers.forEach((driver, index) => {
        setTimeout(() => {
          const distance = Math.random() * 15 + 2;
          const driverDistance = Math.random() * 3 + 1;
          const totalDistance = distance + driverDistance;
          const rate = rideRequest.vehicleType === 'Carro' ? pricingConfig.carMinKmRate : pricingConfig.motoMinKmRate;
          const minFare = rideRequest.vehicleType === 'Carro' ? pricingConfig.carMinFare : pricingConfig.motoMinFare;
          let fare = Math.max(totalDistance * rate, minFare);
          
          // Simulate driver proposing a slightly higher value
          if (Math.random() > 0.7) {
              fare *= 1.15;
          }

          const newOffer: RideOffer = {
            id: `offer_${driver.id}_${rideRequest.id}`,
            driver,
            rideRequestId: rideRequest.id,
            fare,
            driverEta: Math.floor(driverDistance * 2.5) + 1,
          };

          setRideOffers(prev => [...prev, newOffer]);

        }, (index + 1) * 2000); // Stagger offers
      });
    }
  }, [rideRequest, drivers, pricingConfig]);


  const handleLogin = (user: User) => {
    setCurrentUser(user);
    switch (user.role) {
      case UserRole.ADMIN:
        setView(AppView.ADMIN_PANEL);
        break;
      case UserRole.DRIVER:
        setView(AppView.DRIVER_HOME);
        break;
      case UserRole.PASSENGER:
        setView(AppView.PASSENGER_HOME);
        break;
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setRideRequest(null);
    setRideOffers([]);
    setActiveRide(null);
    setView(AppView.LOGIN);
  };
  
  const handleCreateRideRequest = (request: RideRequest) => {
      setRideRequest(request);
  };

  const handleAcceptOffer = (offer: RideOffer) => {
    if(!rideRequest) return;

    const newRide: Ride = {
        id: `ride_${Date.now()}`,
        passenger: rideRequest.passenger,
        driver: offer.driver,
        from: rideRequest.from,
        to: rideRequest.to,
        fare: offer.fare,
        status: RideStatus.ACCEPTED,
    };

    setActiveRide(newRide);
    setRideRequest(null);
    setRideOffers([]);
    setView(AppView.RIDE_IN_PROGRESS);
  };
  
  const handleDriverAcceptOffer = (driver: Driver, fare: number) => {
    if (!rideRequest) return;
    
    // In this simulation, driver directly makes an offer that is shown to passenger.
    // So this is just a simplified offer creation on driver side.
    const driverDistance = Math.random() * 3 + 1;
    const newOffer: RideOffer = {
        id: `offer_${driver.id}_${rideRequest.id}`,
        driver,
        rideRequestId: rideRequest.id,
        fare,
        driverEta: Math.floor(driverDistance * 2.5) + 1,
    };
    
    // In a real app, this offer would be sent to the passenger.
    // Here we just log it, the flow is passenger-driven.
    console.log("Driver created offer:", newOffer);
    alert(`Proposta de R$ ${fare.toFixed(2)} enviada! Aguardando passageiro aceitar.`);
  };
  
  const handleUpdateRideStatus = (status: RideStatus) => {
    if(activeRide) {
        setActiveRide({...activeRide, status});
        if(status === RideStatus.COMPLETED) {
            setTimeout(() => {
                setActiveRide(null);
                setView(currentUser?.role === UserRole.PASSENGER ? AppView.PASSENGER_HOME : AppView.DRIVER_HOME);
            }, 3000);
        }
    }
  };

  const handleCancelRide = () => {
      setActiveRide(null);
      setView(currentUser?.role === UserRole.PASSENGER ? AppView.PASSENGER_HOME : AppView.DRIVER_HOME);
  }

  const renderContent = () => {
    if (!currentUser) {
      return <LoginScreen onLogin={handleLogin} />;
    }

    switch (view) {
      case AppView.ADMIN_PANEL:
        return <AdminPanel pricingConfig={pricingConfig} setPricingConfig={setPricingConfig} allUsers={[...passengers, ...drivers]}/>;
      
      case AppView.PASSENGER_HOME:
        return <PassengerHomeScreen 
                    passenger={currentUser as Passenger} 
                    pricingConfig={pricingConfig} 
                    onCreateRideRequest={handleCreateRideRequest}
                    offers={rideOffers}
                    onAcceptOffer={handleAcceptOffer}
                    availableDrivers={drivers}
                />
      
      case AppView.DRIVER_HOME:
        const driver = currentUser as Driver;
        return <DriverHomeScreen 
                    driver={driver}
                    onToggleOnline={(isOnline) => {
                        const updatedDrivers = drivers.map(d => d.id === driver.id ? {...d, isOnline} : d);
                        setDrivers(updatedDrivers);
                        setCurrentUser({...driver, isOnline});
                    }}
                    // This is a simulation: drivers see the first ride request from anyone.
                    // In a real app, this would be targeted.
                    rideRequest={rideRequest}
                    onAcceptOffer={(fare) => handleDriverAcceptOffer(driver, fare)}
                    pricingConfig={pricingConfig}
                />
        
       case AppView.RIDE_IN_PROGRESS:
            if (activeRide) {
                return <RideInProgressScreen 
                    ride={activeRide}
                    currentUserRole={currentUser.role}
                    onUpdateRideStatus={handleUpdateRideStatus}
                    onCancelRide={handleCancelRide}
                />
            }
            // Fallback to home if no active ride
            setView(currentUser.role === UserRole.PASSENGER ? AppView.PASSENGER_HOME : AppView.DRIVER_HOME);
            return null;

      default:
        return <LoginScreen onLogin={handleLogin} />;
    }
  };
  
  const showHeader = currentUser && view !== AppView.PASSENGER_HOME && view !== AppView.RIDE_IN_PROGRESS;

  return (
    <div className="h-screen w-screen bg-secondary flex flex-col">
        {showHeader && <Header user={currentUser} onLogout={handleLogout} setView={setView}/>}
        <main className="flex-grow overflow-auto">
            {renderContent()}
        </main>
    </div>
  );
};

export default App;
