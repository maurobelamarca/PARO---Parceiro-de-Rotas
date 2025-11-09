
import { PricingConfig, Driver, Passenger, UserRole, ProfileLevel, VehicleType } from './types';

export const DEFAULT_PRICING: PricingConfig = {
  carMinKmRate: 2,
  carMinFare: 8,
  carMinHourlyRate: 40,
  motoMinKmRate: 1.5,
  motoMinFare: 5,
  motoMinHourlyRate: 25,
};

export const MOCK_PASSENGERS: Passenger[] = [
  {
    id: 'pass1',
    name: 'Ana',
    phone: '11987654321',
    role: UserRole.PASSENGER,
    rating: 4.8,
    profileLevel: ProfileLevel.LEVEL_3,
    location: { lat: -23.5505, lng: -46.6333 },
    profilePictureUrl: 'https://picsum.photos/seed/ana/200'
  },
];

export const MOCK_DRIVERS: Driver[] = [
  {
    id: 'driver1',
    name: 'Carlos',
    phone: '11912345678',
    role: UserRole.DRIVER,
    rating: 4.9,
    profileLevel: ProfileLevel.LEVEL_3,
    isOnline: true,
    location: { lat: -23.551, lng: -46.634 },
    vehicle: {
      model: 'Honda Civic',
      plate: 'BRA1Z23',
      type: VehicleType.CAR,
      photos: ['https://picsum.photos/seed/car1/400/300', 'https://picsum.photos/seed/car2/400/300']
    },
    profilePictureUrl: 'https://picsum.photos/seed/carlos/200'
  },
  {
    id: 'driver2',
    name: 'Mariana',
    phone: '11923456789',
    role: UserRole.DRIVER,
    rating: 4.85,
    profileLevel: ProfileLevel.LEVEL_2,
    isOnline: true,
    location: { lat: -23.549, lng: -46.632 },
    vehicle: {
      model: 'Yamaha Fazer',
      plate: 'BRA3Y45',
      type: VehicleType.MOTO,
      photos: ['https://picsum.photos/seed/moto1/400/300', 'https://picsum.photos/seed/moto2/400/300']
    },
     profilePictureUrl: 'https://picsum.photos/seed/mariana/200'
  },
    {
    id: 'driver3',
    name: 'Bruno',
    phone: '11934567890',
    role: UserRole.DRIVER,
    rating: 4.95,
    profileLevel: ProfileLevel.LEVEL_3,
    isOnline: true,
    location: { lat: -23.555, lng: -46.639 },
    vehicle: {
      model: 'Toyota Corolla',
      plate: 'BRA5X67',
      type: VehicleType.CAR,
      photos: ['https://picsum.photos/seed/car3/400/300', 'https://picsum.photos/seed/car4/400/300']
    },
     profilePictureUrl: 'https://picsum.photos/seed/bruno/200'
  }
];

export const MOCK_ADMIN_ID = 'admin_user';

export enum AppView {
    LOGIN,
    PASSENGER_HOME,
    DRIVER_HOME,
    ADMIN_PANEL,
    RIDE_IN_PROGRESS,
    PROFILE
}
