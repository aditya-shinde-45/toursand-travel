import { useMemo } from 'react';

interface EstimateInput {
  pickupAddress: string;
  dropAddress: string;
}

interface EstimateResult {
  distanceKm: number;
  travelTimeMinutes: number;
}

interface LocationResult {
  address: string;
  lat: number;
  lng: number;
}

function roughEstimator(input: EstimateInput): EstimateResult {
  const base = Math.max(10, Math.min(220, Math.floor((input.pickupAddress.length + input.dropAddress.length) * 0.9)));
  return {
    distanceKm: base,
    travelTimeMinutes: Math.max(30, Math.round(base * 2.8)),
  };
}

export function useGoogleMaps() {
  const mapsEnabled = Boolean(import.meta.env.VITE_GOOGLE_MAPS_API_KEY);

  const initializeAutocomplete = (inputElement: HTMLInputElement, onPlaceChange: (place: LocationResult) => void) => {
    if (!mapsEnabled || !window.google) return;

    try {
      const autocomplete = new window.google.maps.places.Autocomplete(inputElement, {
        componentRestrictions: { country: 'IN' },
        fields: ['address_component', 'geometry', 'formatted_address'],
      });

      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (!place.geometry) return;

        onPlaceChange({
          address: place.formatted_address || '',
          lat: place.geometry.location?.lat() || 0,
          lng: place.geometry.location?.lng() || 0,
        });
      });
    } catch (error) {
      console.error('Autocomplete initialization failed:', error);
    }
  };

  return useMemo(
    () => ({
      mapsEnabled,
      initializeAutocomplete,
      async estimateRoute(input: EstimateInput) {
        return roughEstimator(input);
      },
    }),
    [mapsEnabled],
  );
}

// Global type augmentation for Google Maps
declare global {
  namespace NodeJS {
    interface Global {
      google?: any;
    }
  }
  interface Window {
    google?: any;
  }
}
