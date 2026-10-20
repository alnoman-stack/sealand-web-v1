'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';

// এখানে প্রোফাইল ডাটার টাইপ ডিফাইন করা হয়েছে
const AuthContext = createContext<{ user: any | null; loading: boolean }>({
  user: null,
  loading: true,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUserData = async (sessionUser: User | null) => {
      if (!sessionUser) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        // এখন আমরা 'profiles' টেবিল থেকে বিটুবি স্ট্যাটাস ও অন্যান্য তথ্য আনব
        const { data, error } = await supabase
          .from('profiles')
          .select('is_b2b, name, address')
          .eq('id', sessionUser.id)
          .single();

        if (error) {
          console.warn("Profile data not found in 'profiles' table.");
          // প্রোফাইল না থাকলেও ইউজার সেশন সেট করে রাখা হচ্ছে
          setUser(sessionUser); 
        } else {
          // সেশন ইউজারের সাথে প্রোফাইলের ডাটা (is_b2b সহ) মার্জ করা হচ্ছে
          setUser({ ...sessionUser, ...data }); 
        }
      } catch (err) {
        console.error("Auth Error fetching profile:", err);
      } finally {
        setLoading(false);
      }
    };

    // বর্তমান সেশন চেক করা
    supabase.auth.getSession().then(({ data: { session } }) => {
      getUserData(session?.user ?? null);
    });

    // লগইন বা লগআউট হলে অটোমেটিক আপডেট হবে
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      getUserData(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);