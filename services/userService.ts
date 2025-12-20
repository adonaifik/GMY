
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { UserProfile, BloodType, RhFactor } from '../types';

// --- CONFIGURATION ---
const MANUAL_SUPABASE_URL = "https://bupcimlkxezqujprxfks.supabase.co"; 
const MANUAL_SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ1cGNpbWxreGV6cXVqcHJ4ZmtzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU1OTQ1MzMsImV4cCI6MjA4MTE3MDUzM30.fRXXsb7Vvi5TKVNcPnuGL3uABKoe3_ex2AXB8qo2kcQ";

const supabaseUrl = MANUAL_SUPABASE_URL;
const supabaseKey = MANUAL_SUPABASE_KEY;

let supabase: SupabaseClient | null = null;

if (supabaseUrl && supabaseKey) {
    try {
        supabase = createClient(supabaseUrl, supabaseKey);
    } catch (e) {
        console.warn("Supabase client failed to initialize:", e);
    }
}

const generateUserCode = (): string => Math.random().toString(36).substring(2, 7).toUpperCase();
const generateRhFactor = (): RhFactor => Math.random() > 0.5 ? RhFactor.Positive : RhFactor.Negative;

// Local Fallback Storage Helper
const saveLocal = (user: UserProfile) => {
    const localUsers = JSON.parse(localStorage.getItem('blood_app_users') || '[]');
    localUsers.push(user);
    localStorage.setItem('blood_app_users', JSON.stringify(localUsers));
};

const getLocal = (code: string): UserProfile | undefined => {
    const localUsers = JSON.parse(localStorage.getItem('blood_app_users') || '[]');
    return localUsers.find((u: UserProfile) => u.code === code);
};

export const checkServerHealth = async (): Promise<{ online: boolean; error?: string }> => {
    if (!supabase) return { online: false, error: "Config Missing" };
    
    // Very aggressive timeout for diagnostic purposes
    const timeoutPromise = new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error("NETWORK_LAG")), 3000)
    );

    const checkPromise = async () => {
        try {
            const { error } = await supabase!.from('users').select('code').limit(1);
            if (error) {
                if (error.code === '42P01') return { online: false, error: "Database not ready." };
                return { online: false, error: "Access Restricted" };
            }
            return { online: true };
        } catch (e) {
            return { online: false, error: "Connection Failed" };
        }
    };

    try {
        return await Promise.race([checkPromise(), timeoutPromise]);
    } catch (e: any) {
        return { online: false, error: e.message === "NETWORK_LAG" ? "Slow Sync" : "Connection Reset" };
    }
};

export const registerUser = async (name: string, gender: string, email: string, bloodType: BloodType): Promise<UserProfile> => {
    const code = generateUserCode();
    const rhFactor = generateRhFactor();
    const registeredAt = new Date().toLocaleDateString();
    
    const userObject: UserProfile = { code, name, gender, email, bloodType, rhFactor, registeredAt };

    // Always save locally first as a safety net
    saveLocal(userObject);

    if (!supabase) {
        return { ...userObject, name: `${userObject.name} (Local Vault)` };
    }

    const timeoutPromise = new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error("SYNC_TIMEOUT")), 4000)
    );

    const uploadPromise = async () => {
        const { data, error } = await supabase!
            .from('users')
            .insert([{ code, name, gender, email, blood_type: bloodType, rh_factor: rhFactor, registered_at: registeredAt }])
            .select()
            .single();

        if (error) throw error;
        return {
            code: data.code,
            name: data.name,
            gender: data.gender,
            email: data.email,
            bloodType: data.blood_type as BloodType,
            rhFactor: data.rh_factor as RhFactor,
            registeredAt: data.registered_at
        };
    };

    try {
        const result = await Promise.race([uploadPromise(), timeoutPromise]);
        return result;
    } catch (err: any) {
        // Fallback already saved above, just return the local-labeled object
        return { ...userObject, name: `${userObject.name} (Local Copy)` };
    }
};

export const getUserByCode = async (code: string): Promise<UserProfile | undefined> => {
    const localMatch = getLocal(code);
    if (localMatch) return localMatch;

    if (!supabase) return undefined;
    
    try {
        const { data, error } = await supabase.from('users').select('*').eq('code', code).single();
        if (error || !data) return undefined;
        return { 
            code: data.code, 
            name: data.name, 
            gender: data.gender, 
            email: data.email, 
            bloodType: data.blood_type as BloodType, 
            rhFactor: data.rh_factor as RhFactor, 
            registeredAt: data.registered_at 
        };
    } catch (e) {
        return undefined;
    }
};

export const updateUser = async (code: string, updates: { name: string; gender: string; email: string }): Promise<UserProfile> => {
    if (supabase) {
        const { data, error } = await supabase.from('users').update({ 
            name: updates.name, 
            gender: updates.gender, 
            email: updates.email 
        }).eq('code', code).select().single();
        
        if (!error && data) {
            return { 
                code: data.code, 
                name: data.name, 
                gender: data.gender, 
                email: data.email, 
                bloodType: data.blood_type as BloodType, 
                rhFactor: data.rh_factor as RhFactor, 
                registeredAt: data.registered_at 
            };
        }
    }

    const localUsers = JSON.parse(localStorage.getItem('blood_app_users') || '[]');
    const index = localUsers.findIndex((u: UserProfile) => u.code === code);
    if (index !== -1) {
        localUsers[index] = { ...localUsers[index], ...updates };
        localStorage.setItem('blood_app_users', JSON.stringify(localUsers));
        return localUsers[index];
    }
    
    throw new Error("Local profile not found.");
};
