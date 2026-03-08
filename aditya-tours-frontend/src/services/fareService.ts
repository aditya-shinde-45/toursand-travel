const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface FareCalculationRequest {
  distanceKm: number;
  pickupLat?: number;
  pickupLng?: number;
  dropLat?: number;
  dropLng?: number;
    isRoundTrip?: boolean;
}

interface FareBreakdown {
  baseFare: {
    amount: number;
    description: string;
  };
  tollCharges: {
    amount: number;
    description: string;
  };
  total: {
    amount: number;
    description: string;
  };
}

interface RangeInfo {
  fromKm: number;
  toKm: number;
  price: number;
  calculated?: boolean;
}

export interface FareCalculationResponse {
  distanceKm: number;
    effectiveDistance: number;
    isRoundTrip: boolean;
  baseFare: number;
  tollCharges: number;
  totalFare: number;
  rangeInfo: RangeInfo;
  breakdown: FareBreakdown;
  disclaimer: string;
}

export async function calculateFare(params: FareCalculationRequest): Promise<FareCalculationResponse> {
  const response = await fetch(`${API_BASE_URL}/content/calculate-fare`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Failed to calculate fare' }));
    throw new Error(error.error || 'Failed to calculate fare');
  }

  const result = await response.json();
  return result.data;
}
