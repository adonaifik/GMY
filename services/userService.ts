import { UserProfile, BloodType, RhFactor } from '../types';

const STORAGE_KEY = 'bloodtesting_users';
const API_URL = 'http://localhost:3001/api';

// --- Local Fallback Logic (for when server is offline) ---

const generateUserCode = (): string => {
  return Math.random().toString(36).substring(2, 7).toUpperCase();
};

const registerUserLocal = (name: string, gender: string, email: string, bloodType: BloodType): UserProfile => {
  const code = generateUserCode();
  const factors = [RhFactor.Positive, RhFactor.Negative];
  
  const randomFactor = factors[Math.floor(Math.random() * factors.length)];

  const newUser: UserProfile = {
    code,
    name,
    gender,
    email,
    registeredAt: new Date().toLocaleDateString(),
    bloodType: bloodType,
    rhFactor: randomFactor
  };

  const existingData = localStorage.getItem(STORAGE_KEY);
  const users: UserProfile[] = existingData ? JSON.parse(existingData) : [];
  users.push(newUser);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
  
  console.warn("Server unreachable. Used Local Storage fallback.");
  return newUser;
};

const getUserByCodeLocal = (code: string): UserProfile | undefined => {
  const existingData = localStorage.getItem(STORAGE_KEY);
  if (!existingData) return undefined;
  const users: UserProfile[] = JSON.parse(existingData);
  return users.find(u => u.code.toUpperCase() === code.toUpperCase());
};

// --- Async Service Methods ---

export const registerUser = async (name: string, gender: string, email: string, bloodType: BloodType): Promise<UserProfile> => {
    try {
        // Attempt to contact the server
        const response = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, gender, email, bloodType }),
        });

        if (!response.ok) {
            throw new Error('Server response was not ok');
        }

        return await response.json();

    } catch (error) {
        console.log("Server connection failed, falling back to local mode:", error);
        // Fallback to local storage if server is down (prevents app breakage in preview)
        return registerUserLocal(name, gender, email, bloodType);
    }
};

export const getUserByCode = async (code: string): Promise<UserProfile | undefined> => {
    try {
        // Attempt to contact the server
        const response = await fetch(`${API_URL}/user/${code}`);
        
        if (response.status === 404) return undefined;
        if (!response.ok) throw new Error('Server error');

        return await response.json();

    } catch (error) {
        console.log("Server connection failed, falling back to local mode:", error);
        // Fallback to local storage
        return getUserByCodeLocal(code);
    }
};