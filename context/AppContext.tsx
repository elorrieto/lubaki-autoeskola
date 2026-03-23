import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

export interface UserProfile {
  nombre: string;
  apellidos: string;
  dni: string;
  telefono: string;
  direccion: string;
  cuentaBancaria: string;
  username: string;
  peso: string;
  grasaCorporal: string;
  sueno: string;
}

interface AppContextType {
  isLoggedIn: boolean;
  user: UserProfile | null;
  login: (username: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (profile: Omit<UserProfile, "peso" | "grasaCorporal" | "sueno">) => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
}

const AppContext = createContext<AppContextType | null>(null);

const STORAGE_KEY = "@lubaki_user";

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    const restore = async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw) as UserProfile;
          setUser(parsed);
          setIsLoggedIn(true);
        }
      } catch {}
    };
    restore();
  }, []);

  const login = useCallback(async (username: string) => {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as UserProfile;
      setUser(parsed);
    } else {
      const defaultUser: UserProfile = {
        username,
        nombre: username,
        apellidos: "",
        dni: "",
        telefono: "",
        direccion: "",
        cuentaBancaria: "",
        peso: "",
        grasaCorporal: "",
        sueno: "",
      };
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(defaultUser));
      setUser(defaultUser);
    }
    setIsLoggedIn(true);
  }, []);

  const logout = useCallback(async () => {
    setIsLoggedIn(false);
    setUser(null);
  }, []);

  const register = useCallback(
    async (profile: Omit<UserProfile, "peso" | "grasaCorporal" | "sueno">) => {
      const full: UserProfile = {
        ...profile,
        peso: "",
        grasaCorporal: "",
        sueno: "",
      };
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(full));
      setUser(full);
      setIsLoggedIn(true);
    },
    []
  );

  const updateProfile = useCallback(
    async (data: Partial<UserProfile>) => {
      const updated = { ...user, ...data } as UserProfile;
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      setUser(updated);
    },
    [user]
  );

  return (
    <AppContext.Provider
      value={{ isLoggedIn, user, login, logout, register, updateProfile }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
