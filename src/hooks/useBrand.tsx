import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { useAuth } from './useAuth';

export interface BrandProfile {
  name: string;
  website: string;
  category: string;
  price: string;
  target: string;
  desc_bn: string;
  c1: string;
  c2: string;
  c3: string;
}

const defaultBrand: BrandProfile = {
  name: "",
  website: "",
  category: "Fashion & Clothing",
  price: "৳500–৳2,000",
  target: "",
  desc_bn: "",
  c1: "",
  c2: "",
  c3: ""
};

interface BrandContextType {
  brand: BrandProfile;
  setBrand: (b: BrandProfile) => void;
}

const BrandContext = createContext<BrandContextType | null>(null);

export function BrandProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [brand, setBrandState] = useState<BrandProfile>(defaultBrand);

  useEffect(() => {
    if (user) {
      const key = `bup_brand_profile_${user.email}`;
      const saved = localStorage.getItem(key);
      if (saved) {
        try {
          setBrandState({ ...defaultBrand, ...JSON.parse(saved) });
        } catch (e) {
          setBrandState(defaultBrand);
        }
      } else {
        setBrandState(defaultBrand);
      }
    } else {
      setBrandState(defaultBrand);
    }
  }, [user]);

  const setBrand = (newBrand: BrandProfile) => {
    setBrandState(newBrand);
    if (user) {
      const key = `bup_brand_profile_${user.email}`;
      localStorage.setItem(key, JSON.stringify(newBrand));
    }
  };

  return (
    <BrandContext.Provider value={{ brand, setBrand }}>
      {children}
    </BrandContext.Provider>
  );
}

export function useBrand() {
  const context = useContext(BrandContext);
  if (!context) throw new Error('useBrand must be used within a BrandProvider');
  return context;
}
