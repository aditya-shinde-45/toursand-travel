import { useState, useRef, useEffect } from 'react';
import { MapPin } from 'lucide-react';
import MapPickerModal from './MapPickerModal';
import { useGoogleMaps } from '../../hooks/useGoogleMaps';

interface LocationPickerProps {
  label: string;
  value: string;
  onChange: (value: string, coordinates?: { lat: number; lng: number }) => void;
  placeholder: string;
  helperText?: string;
  error?: string;
  touched?: boolean;
}

function LocationPicker({ label, value, onChange, placeholder, helperText, error, touched }: LocationPickerProps) {
  const [showMapPicker, setShowMapPicker] = useState(false);
  const showError = error && touched;
  const inputRef = useRef<HTMLInputElement>(null);
  const { initializeAutocomplete, mapsEnabled } = useGoogleMaps();

  useEffect(() => {
    if (inputRef.current && mapsEnabled) {
      initializeAutocomplete(inputRef.current, (place) => {
        onChange(place.address, { lat: place.lat, lng: place.lng });
      });
    }
  }, [mapsEnabled, initializeAutocomplete, onChange]);

  const handleMapClick = () => {
    setShowMapPicker(true);
  };

  const handleLocationSelect = (location: { address: string; lat: number; lng: number }) => {
    onChange(location.address, { lat: location.lat, lng: location.lng });
  };

  return (
    <label className="grid gap-1 text-sm font-medium text-slate-700">
      <span>{label}</span>
      <div className="flex gap-2">
        <input
          ref={inputRef}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className={`flex-1 h-12 rounded-lg border px-3 outline-none transition ${
            showError
              ? 'border-red-300 ring-red-500 focus:ring'
              : 'border-slate-300 ring-blue-500 focus:ring'
          }`}
        />
        <button
          type="button"
          onClick={handleMapClick}
          className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-700 hover:bg-slate-50 transition"
          title="Pick location from map"
        >
          <MapPin className="h-4 w-4" />
          <span className="text-xs">Map</span>
        </button>
      </div>
      {helperText && !showError ? <span className="text-xs text-slate-500">{helperText}</span> : null}
      {showError ? <span className="text-xs text-red-600">{error}</span> : null}
          <MapPickerModal
            isOpen={showMapPicker}
            onClose={() => setShowMapPicker(false)}
            onLocationSelect={handleLocationSelect}
          />
    </label>
  );
}

export default LocationPicker;
