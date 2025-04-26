import { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '@/lib/supabase';
import { Session } from '@supabase/supabase-js';

interface UserType {
  id: string;
  branch_id: string;
  name: string;
  title: string;
  avatar_url: string;
  break: boolean;
}
interface ShiftType {
  user_id: string;
  day: string;
  shift: string;
}
interface ProductType {
  name: string;
  image_url: string;
}
interface AuthContextType {
  session: Session | null;
  user: UserType | null;
  shift: ShiftType[] | null;
  product: ProductType[] | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  fetchShift: (id: string) => Promise<void>;
  fetchProduct: () => Promise<void>;
  setInventory: (inventoryProduct: any) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<UserType | null>(null);
  const [shift, setShift] = useState<ShiftType[]>([]);
  const [product, setProduct] = useState<ProductType[]>([]);

  useEffect(() => {
    const loadSession = async () => {
      try {
        const storedSession = await AsyncStorage.getItem('session');
        if (storedSession) {
          const parsedSession: Session = JSON.parse(storedSession);
          setSession(parsedSession);
          fetchUser(parsedSession.user.id);
        } else {
          const { data } = await supabase.auth.getSession();
          setSession(data.session);
          if (data.session?.user) {
            fetchUser(data.session.user.id);
          }
        }
      } catch (error) {
        console.error('Error loading session from storage:', error);
      }
    };

    loadSession();

    const { data: listener } = supabase.auth.onAuthStateChange((_, session) => {
      if (session) {
        AsyncStorage.setItem('session', JSON.stringify(session));
        setSession(session);
        fetchUser(session?.user.id);
        fetchShift(session?.user.id);
      } else {
        AsyncStorage.removeItem('session');
        setSession(null);
        setUser(null);
        setShift([]);
      }
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const fetchUser = async (id: string) => {
    const { data: userData, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id.trim())
      .single();

    if (!error) {
      setUser(userData);
    }
  };

  const fetchShift = async (id: string) => {
    const { data: shiftData, error: shiftError } = await supabase
    .from("shifts")
    .select("*")
    .eq("user_id", id)
    .order("id", {ascending: true});
    if (!shiftError) {
      setShift(shiftData || []);
    }
  }

  const fetchProduct = async () => {
    const { data: productData, error:productError } = await supabase
    .from("products")
    .select("name,image_url");
    if(!productError) {
      setProduct(productData || []);
    }
  }

  const setInventory = async (inventoryProduct: any) => {
    const { data, error } = await supabase
        .from("inventory")
        .insert(inventoryProduct);

    if (error) {
        console.error("Ürün eklenirken hata oluştu:", error);
    } else {
        console.log("Ürünler başarıyla eklendi:", data);
    }
};

  const login = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    if (data.session) {
      await AsyncStorage.setItem('session', JSON.stringify(data.session));
      setSession(data.session);
      fetchUser(data.session.user.id);
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    await AsyncStorage.removeItem('session');
    setSession(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ session, user,shift, product, login, logout, fetchShift, fetchProduct, setInventory, }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};