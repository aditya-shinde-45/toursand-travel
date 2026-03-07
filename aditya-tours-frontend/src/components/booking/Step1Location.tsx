import { useState, useEffect } from 'react';
import type { UseFormReturn } from 'react-hook-form';
import { useGoogleMaps } from '../../hooks/useGoogleMaps';
import type { BookingFlowInput } from './BookingFlow.tsx';
import LocationPicker from './LocationPicker';
import RouteMap from './RouteMap';
import PriceDisplay from './PriceDisplay';

interface Step1LocationProps {
  form: UseFormReturn<BookingFlowInput>;
}

function Step1Location({ form }: Step1LocationProps) {
  useGoogleMaps();
  const [pickupAddress, setPickupAddress] = useState('');
  const [dropAddress, setDropAddress] = useState('');
  const [pickupCoords, setPickupCoords] = useState({ lat: 19.2183, lng: 72.9781 });
  const [dropCoords, setDropCoords] = useState({ lat: 19.076, lng: 72.8777 });
  const [tripType, setTripType] = useState<'ONE_WAY' | 'ROUND_TRIP'>('ONE_WAY');
  const [distanceKm, setDistanceKm] = useState(0);
  const [travelTimeMinutes, setTravelTimeMinutes] = useState(0);

  useEffect(() => {
    if (pickupAddress && dropAddress && pickupCoords && dropCoords) {
      const calculate = async () => {
        form.setValue('pickupLocation', { address: pickupAddress, ...pickupCoords });
        form.setValue('dropLocation', { address: dropAddress, ...dropCoords });
        form.setValue('tripType', tripType);
        
        // Calculate distance using Haversine formula
        const R = 6371; // Earth's radius in km
        const dLat = (dropCoords.lat - pickupCoords.lat) * Math.PI / 180;
        const dLon = (dropCoords.lng - pickupCoords.lng) * Math.PI / 180;
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                  Math.cos(pickupCoords.lat * Math.PI / 180) * Math.cos(dropCoords.lat * Math.PI / 180) *
                  Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        const straightDistance = R * c;
        
        // Better road factor based on distance
        let roadFactor = 1.2;
        if (straightDistance > 80) roadFactor = 1.25; // Highway routes
        else if (straightDistance > 30) roadFactor = 1.3; // Inter-city
        else roadFactor = 1.4; // City routes
        
        const distance = straightDistance * roadFactor;
        
        // Better time estimate based on distance
        let avgSpeed = 40; // km/h for city
        if (distance > 80) avgSpeed = 60; // Highway
        else if (distance > 30) avgSpeed = 50; // Inter-city
        
        const time = Math.round((distance / avgSpeed) * 60); // Convert to minutes
        
        setDistanceKm(Math.round(distance));
        setTravelTimeMinutes(time);
        form.setValue('distanceKm', Math.round(distance));
        form.setValue('travelTimeMinutes', time);
      };
      calculate();
    }
  }, [pickupAddress, dropAddress, pickupCoords, dropCoords, tripType, form]);

  return (
    <div className="grid gap-4">
      <LocationPicker
        label="Pickup Location"
        value={pickupAddress}
        onChange={(value, coordinates) => {
          setPickupAddress(value);
          if (coordinates) setPickupCoords(coordinates);
        }}
        placeholder="Search in Thane..."
        helperText="Pickup is prioritized in Thane service area"
        error={form.formState.errors.pickupLocation?.address?.message}
      />
      <LocationPicker
        label="Drop Location"
        value={dropAddress}
        onChange={(value, coordinates) => {
          setDropAddress(value);
          if (coordinates) setDropCoords(coordinates);
        }}
        placeholder="Search destination..."
        error={form.formState.errors.dropLocation?.address?.message}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="rounded-lg border border-slate-300 p-3 text-sm font-medium">
          <input
            type="radio"
            checked={tripType === 'ONE_WAY'}
            onChange={() => setTripType('ONE_WAY')}
            className="mr-2"
          />
          One Way
        </label>
        <label className="rounded-lg border border-slate-300 p-3 text-sm font-medium">
          <input
            type="radio"
            checked={tripType === 'ROUND_TRIP'}
            onChange={() => setTripType('ROUND_TRIP')}
            className="mr-2"
          />
          Round Trip
        </label>
      </div>

      <RouteMap
        pickupAddress={pickupAddress}
        dropAddress={dropAddress}
        distanceKm={distanceKm}
        travelTimeMinutes={travelTimeMinutes}
      />

      <PriceDisplay distanceKm={distanceKm} travelTimeMinutes={travelTimeMinutes} />
    </div>
  );
}

export default Step1Location;
