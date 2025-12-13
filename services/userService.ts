import { UserProfile, BloodType, RhFactor } from '../types';

const STORAGE_KEY = 'bloodtesting_users';

// Dynamic API URL generation
const getApiUrl = () => {
  if (typeof window === 'undefined') return 'http://localhost:3001/api';

  const { hostname, protocol } = window.location;
  
  // Handle case where file is opened directly (file://) or explicit localhost
  if (!hostname || protocol === 'file:' || hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'http://localhost:3001/api';
  }
  
  // Use current protocol to avoid Mixed Content errors, but keep port 3001
  // Note: If frontend is HTTPS and backend is HTTP, this will still fail due to browser security (Mixed Content).
  // Ideally, backend should be proxied or run on HTTPS in production.
  return `${protocol}//${hostname}:3001/api`;
};

const API_URL = getApiUrl();

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
  
  return newUser;
};

const updateUserLocal = (code: string, updates: Partial<UserProfile>): UserProfile | undefined => {
  const existingData = localStorage.getItem(STORAGE_KEY);
  if (!existingData) return undefined;
  
  const users: UserProfile[] = JSON.parse(existingData);
  const index = users.findIndex(u => u.code.toUpperCase() === code.toUpperCase());
  
  if (index === -1) return undefined;
  
  const updatedUser = { ...users[index], ...updates };
  users[index] = updatedUser;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
  
  return updatedUser;
};

const getUserByCodeLocal = (code: string): UserProfile | undefined => {
  const existingData = localStorage.getItem(STORAGE_KEY);
  if (!existingData) return undefined;
  const users: UserProfile[] = JSON.parse(existingData);
  return users.find(u => u.code.toUpperCase() === code.toUpperCase());
};

// --- Async Service Methods ---

export const checkServerHealth = async (): Promise<boolean> => {
    try {
        // Use no-store to prevent caching of failed/offline status
        const response = await fetch(`${API_URL}/health`, { 
            method: 'GET',
            cache: 'no-store'
        });
        return response.ok;
    } catch (e) {
        return false;
    }
};

export const registerUser = async (name: string, gender: string, email: string, bloodType: BloodType): Promise<UserProfile> => {
    try {
        // Attempt to contact the server with a timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout

        const response = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, gender, email, bloodType }),
            signal: controller.signal
        });
        clearTimeout(timeoutId);

        if (!response.ok) {
            throw new Error('Server response was not ok');
        }

        return await response.json();

    } catch (error) {
        console.warn("Server connection failed, falling back to local mode.", error);
        // Fallback to local storage if server is down or unreachable
        return registerUserLocal(name, gender, email, bloodType);
    }
};

export const updateUser = async (code: string, updates: { name: string; gender: string; email: string }): Promise<UserProfile> => {
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        const response = await fetch(`${API_URL}/user/${code}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updates),
            signal: controller.signal
        });
        clearTimeout(timeoutId);

        if (!response.ok) {
            throw new Error('Server response was not ok');
        }

        return await response.json();

    } catch (error) {
        console.warn("Server connection failed, falling back to local mode.");
        const localUpdated = updateUserLocal(code, updates);
        if (!localUpdated) {
             throw new Error("Could not update user locally or on server");
        }
        return localUpdated;
    }
};

export const getUserByCode = async (code: string): Promise<UserProfile | undefined> => {
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        // Attempt to contact the server
        const response = await fetch(`${API_URL}/user/${code}`, {
            signal: controller.signal
        });
        clearTimeout(timeoutId);
        
        if (response.status === 404) return undefined;
        if (!response.ok) throw new Error('Server error');

        return await response.json();

    } catch (error) {
        console.warn("Server connection failed, falling back to local mode.");
        // Fallback to local storage
        return getUserByCodeLocal(code);
    }
};