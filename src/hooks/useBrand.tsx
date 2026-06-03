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

export interface ScrapedBrandData {
  score: number;
  total_mentions: number;
  positive_sentiment: number;
  active_campaigns: number;
  sentiment_timeline: number[];
  share_of_voice: { name: string; v: number; color: string }[];
  recent_mentions: { emoji: string; text: string; sentiment: 'Positive' | 'Neutral' | 'Negative'; plat: string; time: string; }[];
  report: {
    summary: string;
    actions: string[];
    highlight: string;
  };
  health_report: {
    weekly_summary_bn: string;
    top_performing_content_bn: string;
    actions_bn: string[];
    opportunities_bn: string[];
    risks_bn: string[];
  };
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
  scrapedData: ScrapedBrandData | null;
  isScraping: boolean;
  scrapingError: string | null;
  triggerScrape: (activeBrand?: BrandProfile) => Promise<ScrapedBrandData>;
}

const BrandContext = createContext<BrandContextType | null>(null);

export function BrandProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [brand, setBrandState] = useState<BrandProfile>(defaultBrand);
  const [scrapedData, setScrapedData] = useState<ScrapedBrandData | null>(null);
  const [isScraping, setIsScraping] = useState<boolean>(false);
  const [scrapingError, setScrapingError] = useState<string | null>(null);

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

      const scrapeKey = `bup_scraped_data_${user.email}`;
      const savedScrape = localStorage.getItem(scrapeKey);
      if (savedScrape) {
        try {
          setScrapedData(JSON.parse(savedScrape));
        } catch (e) {
          setScrapedData(null);
        }
      } else {
        setScrapedData(null);
      }
    } else {
      setBrandState(defaultBrand);
      setScrapedData(null);
    }
    setScrapingError(null);
  }, [user]);

  const setBrand = (newBrand: BrandProfile) => {
    const keyChanged = 
      brand.name !== newBrand.name ||
      brand.website !== newBrand.website ||
      brand.category !== newBrand.category ||
      brand.desc_bn !== newBrand.desc_bn ||
      brand.target !== newBrand.target ||
      brand.c1 !== newBrand.c1 ||
      brand.c2 !== newBrand.c2 ||
      brand.c3 !== newBrand.c3;

    setBrandState(newBrand);
    if (user) {
      const key = `bup_brand_profile_${user.email}`;
      localStorage.setItem(key, JSON.stringify(newBrand));
      
      if (keyChanged) {
        setScrapedData(null);
        const scrapeKey = `bup_scraped_data_${user.email}`;
        localStorage.removeItem(scrapeKey);
      }
    }
  };

  const triggerScrape = async (activeBrand?: BrandProfile): Promise<ScrapedBrandData> => {
    const brandToScrape = activeBrand || brand;
    if (!brandToScrape.name) {
      throw new Error("Brand name must be configured before scraping data.");
    }

    setIsScraping(true);
    setScrapingError(null);
    try {
      const response = await fetch('/api/scrape-brand', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(brandToScrape)
      });
      
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error || "Failed to trigger real-time search grounded scraping");
      }

      const data: ScrapedBrandData = payload.result;
      setScrapedData(data);
      if (user) {
        const scrapeKey = `bup_scraped_data_${user.email}`;
        localStorage.setItem(scrapeKey, JSON.stringify(data));
      }
      setIsScraping(false);
      return data;
    } catch (err: any) {
      const errMsg = err.message || "Scraping failed";
      setScrapingError(errMsg);
      setIsScraping(false);
      throw err;
    }
  };

  return (
    <BrandContext.Provider value={{ brand, setBrand, scrapedData, isScraping, scrapingError, triggerScrape }}>
      {children}
    </BrandContext.Provider>
  );
}

export function useBrand() {
  const context = useContext(BrandContext);
  if (!context) throw new Error('useBrand must be used within a BrandProvider');
  return context;
}
