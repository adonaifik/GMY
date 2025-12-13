import { UserProfile, BloodType, RhFactor } from '../types';

const STORAGE_KEY = 'bloodtesting_users';

// Dynamic API URL generation
// This allows cross-device access on the same local network.
// If accessing via localhost, it targets localhost:3001.
// If accessing via 192.168.x.x, it targets 192.168.x.x:3001.
const getApiUrl = () => {
  const hostname = window.location.hostname;
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'http://localhost:3001/api';
  }
  // Assume server is running on the same host, port 3001
  return `http://${hostname}:3001/api`;
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
        const response = await fetch(`${API_URL}/health`, { method: 'GET' });
        return response.ok;
    } catch (e) {
        return false;
    }
};

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
        console.warn("Server connection failed, falling back to local mode.");
        // Fallback to local storage if server is down
        return registerUserLocal(name, gender, email, bloodType);
    }
};

export const updateUser = async (code: string, updates: { name: string; gender: string; email: string }): Promise<UserProfile> => {
    try {
        const response = await fetch(`${API_URL}/user/${code}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updates),
        });

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
        // Attempt to contact the server
        const response = await fetch(`${API_URL}/user/${code}`);
        
        if (response.status === 404) return undefined;
        if (!response.ok) throw new Error('Server error');

        return await response.json();

    } catch (error) {
        console.warn("Server connection failed, falling back to local mode.");
        // Fallback to local storage
        return getUserByCodeLocal(code);
    }
};