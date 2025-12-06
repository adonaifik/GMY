import { UserProfile, BloodType, RhFactor } from '../types';

const STORAGE_KEY = 'bloodtesting_users';

export const generateUserCode = (): string => {
  // Generate a random 5-character alphanumeric string (uppercase)
  return Math.random().toString(36).substring(2, 7).toUpperCase();
};

export const registerUser = (name: string, gender: string, email: string): UserProfile => {
  const code = generateUserCode();
  
  // Simulate a lab result by randomly assigning blood type
  const types = [BloodType.A, BloodType.B, BloodType.AB, BloodType.O];
  const factors = [RhFactor.Positive, RhFactor.Negative];
  
  const randomType = types[Math.floor(Math.random() * types.length)];
  const randomFactor = factors[Math.floor(Math.random() * factors.length)];

  const newUser: UserProfile = {
    code,
    name,
    gender,
    email,
    registeredAt: new Date().toLocaleDateString(),
    bloodType: randomType,
    rhFactor: randomFactor
  };

  const existingData = localStorage.getItem(STORAGE_KEY);
  const users: UserProfile[] = existingData ? JSON.parse(existingData) : [];
  
  users.push(newUser);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
  
  return newUser;
};

export const getUserByCode = (code: string): UserProfile | undefined => {
  const existingData = localStorage.getItem(STORAGE_KEY);
  if (!existingData) return undefined;
  
  const users: UserProfile[] = JSON.parse(existingData);
  return users.find(u => u.code.toUpperCase() === code.toUpperCase());
};