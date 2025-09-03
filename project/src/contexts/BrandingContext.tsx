import React, { createContext, useContext, useState } from 'react';

interface BrandingSettings {
  portalName: string;
  logoUrl?: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
}

interface BrandingContextType {
  branding: BrandingSettings;
  updateBranding: (updates: Partial<BrandingSettings>) => Promise<void>;
  loading: boolean;
}

const BrandingContext = createContext<BrandingContextType | undefined>(undefined);

export function BrandingProvider({ children }: { children: React.ReactNode }) {
  const [branding, setBranding] = useState<BrandingSettings>({
    portalName: 'Riyada Trainings',
    primaryColor: '#2563EB',
    secondaryColor: '#059669',
    accentColor: '#EA580C'
  });
  const [loading] = useState(false);

  const updateBranding = async (updates: Partial<BrandingSettings>) => {
    try {
      const updatedBranding = { ...branding, ...updates };
      setBranding(updatedBranding);
    } catch (err) {
      console.error('Error updating branding settings:', err);
      throw err;
    }
  };

  return (
    <BrandingContext.Provider value={{ branding, updateBranding, loading }}>
      {children}
    </BrandingContext.Provider>
  );
}

export function useBranding() {
  const context = useContext(BrandingContext);
  if (context === undefined) {
    throw new Error('useBranding must be used within a BrandingProvider');
  }
  return context;
}