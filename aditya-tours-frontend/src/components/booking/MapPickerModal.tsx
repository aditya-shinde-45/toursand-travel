import { useState, useEffect, useRef } from 'react';
import { X, Search, MapPin as MapPinIcon } from 'lucide-react';

interface MapPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLocationSelect: (location: { address: string; lat: number; lng: number }) => void;
}

interface SelectedLocation {
  address: string;
  lat: number;
  lng: number;
}

function MapPickerModal({ isOpen, onClose, onLocationSelect }: MapPickerModalProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [marker, setMarker] = useState<any>(null);
  const [searchInput, setSearchInput] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<SelectedLocation | null>(null);
  const autocompleteRef = useRef<any>(null);

  // Initialize map
  useEffect(() => {
    if (!isOpen || !mapRef.current || !window.google) return;

    const newMap = new window.google.maps.Map(mapRef.current, {
      zoom: 12,
      center: { lat: 19.0760, lng: 72.8777 }, // Mumbai center as default
      mapTypeControl: true,
      fullscreenControl: true,
      zoomControl: true,
      streetViewControl: false,
    });

    const newMarker = new window.google.maps.Marker({
      map: newMap,
      draggable: true,
      animation: window.google.maps.Animation.DROP,
    });

    // Handle marker drag
    newMarker.addListener('dragend', () => {
      const position = newMarker.getPosition();
      updateLocationFromCoordinates(position.lat(), position.lng());
    });

    // Handle map click
    newMap.addListener('click', (e: any) => {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      newMarker.setPosition({ lat, lng });
      updateLocationFromCoordinates(lat, lng);
    });

    setMap(newMap);
    setMarker(newMarker);

    // Initialize autocomplete for search input
    initializeAutocomplete();

    return () => {
      // Cleanup
      if (newMarker) {
        newMarker.setMap(null);
      }
    };
  }, [isOpen]);

  const initializeAutocomplete = () => {
    if (!window.google) return;

    const input = document.getElementById('map-search-input') as HTMLInputElement;
    if (!input) return;

    const autocomplete = new window.google.maps.places.Autocomplete(input, {
      componentRestrictions: { country: 'IN' },
      fields: ['formatted_address', 'geometry', 'address_component'],
    });

    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      if (!place.geometry || !place.geometry.location) return;

      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();

      // Center map on selected location
      if (map) {
        map.setCenter({ lat, lng });
        map.setZoom(15);
      }

      // Update marker
      if (marker) {
        marker.setPosition({ lat, lng });
      }

      // Update location
      updateLocationFromCoordinates(lat, lng, place.formatted_address);
    });

    autocompleteRef.current = autocomplete;
  };

  const updateLocationFromCoordinates = async (lat: number, lng: number, address?: string) => {
    let finalAddress = address;

    // If no address provided, reverse geocode
    if (!finalAddress && window.google) {
      try {
        const geocoder = new window.google.maps.Geocoder();
        const result = await new Promise((resolve, reject) => {
          geocoder.geocode({ location: { lat, lng } }, (results: any, status: any) => {
            if (status === 'OK' && results && results[0]) {
              resolve(results[0].formatted_address);
            } else {
              reject(new Error('Geocoding failed'));
            }
          });
        });
        finalAddress = result as string;
      } catch (error) {
        console.error('Reverse geocoding error:', error);
        finalAddress = `Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`;
      }
    }

    setSelectedLocation({
      address: finalAddress ?? `Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`,
      lat,
      lng,
    });
  };

  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          if (map) {
            map.setCenter({ lat: latitude, lng: longitude });
            map.setZoom(15);
          }
          if (marker) {
            marker.setPosition({ lat: latitude, lng: longitude });
          }
          updateLocationFromCoordinates(latitude, longitude);
        },
        (error) => {
          console.error('Geolocation error:', error);
          alert('Unable to access your location. Please check permissions.');
        }
      );
    } else {
      alert('Geolocation is not supported by your browser.');
    }
  };

  const handleConfirm = () => {
    if (selectedLocation) {
      onLocationSelect(selectedLocation);
      onClose();
    } else {
      alert('Please select a location on the map');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-40 backdrop-blur-sm">
      <div className="relative h-[90vh] w-[90vw] max-w-4xl rounded-lg bg-white shadow-2xl">
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 z-10 flex items-center gap-2 bg-white p-4 border-b border-slate-200">
          <Search className="h-5 w-5 text-slate-400" />
          <input
            id="map-search-input"
            type="text"
            placeholder="Search location or drag marker on map..."
            className="flex-1 outline-none text-sm"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          <button
            type="button"
            onClick={handleUseCurrentLocation}
            className="flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-2 text-sm text-blue-600 hover:bg-blue-100 transition"
            title="Use current location"
          >
            <MapPinIcon className="h-4 w-4" />
            Current
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex items-center justify-center rounded-lg p-2 hover:bg-slate-100 transition"
          >
            <X className="h-5 w-5 text-slate-600" />
          </button>
        </div>

        {/* Map Container */}
        <div ref={mapRef} className="absolute inset-0 top-16 bottom-16 w-full" />

        {/* Selected Location Display */}
        {selectedLocation && (
          <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4">
            <div className="mb-3">
              <p className="text-sm text-slate-600">Selected Location:</p>
              <p className="font-medium text-slate-900">{selectedLocation.address}</p>
              <p className="text-xs text-slate-500">
                Lat: {selectedLocation.lat.toFixed(4)}, Lng: {selectedLocation.lng.toFixed(4)}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleConfirm}
                className="flex-1 rounded-lg bg-[#FF9933] px-4 py-2 text-sm font-medium text-white hover:bg-orange-600 transition"
              >
                Confirm Location
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Loading state if no location selected */}
        {!selectedLocation && (
          <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 text-center">
            <p className="text-sm text-slate-600">Click on the map to select a location or search above</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default MapPickerModal;
