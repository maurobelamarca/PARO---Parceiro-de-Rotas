
export enum UserRole {
  PASSENGER = 'PASSENGER',
  DRIVER = 'DRIVER',
  ADMIN = 'ADMIN',
}

export enum ProfileLevel {
  LEVEL_1 = 1,
  LEVEL_2 = 2,
  LEVEL_3 = 3,
}

export interface User {
  id: string;
  name: string;
  phone: string;
  profilePictureUrl?: string;
  role: UserRole;
  rating: number;
  profileLevel: ProfileLevel;
}

export interface Driver extends User {
  role: UserRole.DRIVER;
  isOnline: boolean;
  vehicle: Vehicle;
  location: { lat: number; lng: number };
}

export interface Passenger extends User {
  role: UserRole.PASSENGER;
  location: { lat: number; lng: number };
}

export interface Vehicle {
  model: string;
  plate: string;
  type: VehicleType;
  photos: string[];
}

export enum VehicleType {
  CAR = 'Carro',
  MOTO = 'Moto',
}

export interface RideLocation {
  address: string;
  lat: number;
  lng: number;
}

export enum RideRequestStatus {
  SEARCHING = 'SEARCHING',
  OFFERS_RECEIVED = 'OFFERS_RECEIVED',
  CANCELLED = 'CANCELLED',
}

export interface RideRequest {
  id: string;
  passenger: Passenger;
  from: RideLocation;
  to: RideLocation;
  vehicleType: VehicleType;
  status: RideRequestStatus;
  createdAt: number;
}

export interface RideOffer {
  id: string;
  driver: Driver;
  rideRequestId: string;
  fare: number;
  driverEta: number; // in minutes
}

export enum RideStatus {
  ACCEPTED = 'ACCEPTED',
  DRIVER_ARRIVING = 'DRIVER_ARRIVING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED_BY_PASSENGER = 'CANCELLED_BY_PASSENGER',
  CANCELLED_BY_DRIVER = 'CANCELLED_BY_DRIVER',
}

export interface Ride {
  id: string;
  passenger: Passenger;
  driver: Driver;
  from: RideLocation;
  to: RideLocation;
  fare: number;
  status: RideStatus;
  startTime?: number;
  endTime?: number;
}

export interface PricingConfig {
  carMinKmRate: number;
  carMinFare: number;
  carMinHourlyRate: number;
  motoMinKmRate: number;
  motoMinFare: number;
  motoMinHourlyRate: number;
}
