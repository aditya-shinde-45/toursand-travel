import { useState } from 'react';
import { Plus, Edit2, Trash2, MapPin } from 'lucide-react';
import type { PopularRoute } from '../../types/content';
import { POPULAR_ROUTES } from '../../utils/constants';
import { savePopularRoutesData } from '../../services/contentSettingsService';
import { formatCurrency } from '../../utils/formatting';
import MapPickerModal from '../booking/MapPickerModal';

interface RouteFormData {
  id: string;
  pickupLocation: string;
  pickupAddress: string;
  destinationName: string;
  destinationAddress: string;
  distanceKm: number;
  travelTimeMinutes: number;
  estimatedFare: number;
  displayOrder: number;
}

function RouteManager() {
  const [routes, setRoutes] = useState<PopularRoute[]>(POPULAR_ROUTES);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isMapPickerOpen, setIsMapPickerOpen] = useState(false);
  const [mapPickerType, setMapPickerType] = useState<'pickup' | 'destination' | null>(null);

  const [formData, setFormData] = useState<RouteFormData>({
    id: '',
    pickupLocation: '',
    pickupAddress: '',
    destinationName: '',
    destinationAddress: '',
    distanceKm: 0,
    travelTimeMinutes: 0,
    estimatedFare: 0,
    displayOrder: 0,
  });

  const handleEdit = (route: PopularRoute) => {
    setEditingId(route.id);
    setFormData(route);
    setIsAdding(false);
  };

  const handleAdd = () => {
    setIsAdding(true);
    setEditingId(null);
    setFormData({
      id: `route-${Date.now()}`,
      pickupLocation: '',
      pickupAddress: '',
      destinationName: '',
      destinationAddress: '',
      distanceKm: 0,
      travelTimeMinutes: 0,
      estimatedFare: 0,
      displayOrder: routes.length + 1,
    });
  };

  const handleSave = () => {
    if (
      !formData.pickupLocation ||
      !formData.destinationName ||
      formData.distanceKm === 0 ||
      formData.estimatedFare === 0
    ) {
      alert('Please fill all required fields');
      return;
    }

    let updatedRoutes: PopularRoute[];
    if (isAdding) {
      updatedRoutes = [...routes, formData];
    } else {
      updatedRoutes = routes.map((r) => (r.id === editingId ? formData : r));
    }

    setRoutes(updatedRoutes);
    savePopularRoutesData(updatedRoutes);

    setEditingId(null);
    setIsAdding(false);
    setFormData({
      id: '',
      pickupLocation: '',
      pickupAddress: '',
      destinationName: '',
      destinationAddress: '',
      distanceKm: 0,
      travelTimeMinutes: 0,
      estimatedFare: 0,
      displayOrder: 0,
    });
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this route?')) {
      const updatedRoutes = routes.filter((r) => r.id !== id);
      setRoutes(updatedRoutes);
      savePopularRoutesData(updatedRoutes);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setIsAdding(false);
  };

  const handleMapPickerOpen = (type: 'pickup' | 'destination') => {
    setMapPickerType(type);
    setIsMapPickerOpen(true);
  };

  const getDisplayLocationFromAddress = (address: string) => {
    const parts = address
      .split(',')
      .map((part) => part.trim())
      .filter(Boolean);

    if (parts.length === 0) return address;

    const isWeakLabel = (value: string) => {
      const cleaned = value.replace(/[^a-zA-Z0-9\s]/g, '').trim();
      if (!cleaned) return true;
      if (/^\d/.test(cleaned)) return true;
      if (/^(at|near|opp|opposite)$/i.test(cleaned)) return true;
      return cleaned.length <= 2;
    };

    const meaningfulPart = parts.find((part) => !isWeakLabel(part));
    return meaningfulPart ?? parts[0];
  };

  const handleLocationSelect = (location: { address: string; lat: number; lng: number }) => {
    const displayLocation = getDisplayLocationFromAddress(location.address);

    if (mapPickerType === 'pickup') {
      setFormData({
        ...formData,
        pickupLocation: displayLocation,
        pickupAddress: location.address,
      });
    } else if (mapPickerType === 'destination') {
      setFormData({
        ...formData,
        destinationName: displayLocation,
        destinationAddress: location.address,
      });
    }
    setIsMapPickerOpen(false);
    setMapPickerType(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Popular Routes Management</h2>
        {!isAdding && !editingId && (
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 rounded-lg bg-[#FF9933] px-4 py-2 text-sm font-semibold text-white hover:bg-[#ff8c1f]"
          >
            <Plus className="h-4 w-4" />
            Add Route
          </button>
        )}
      </div>

      {/* Add/Edit Form */}
      {(isAdding || editingId) && (
        <div className="rounded-lg border border-slate-300 bg-blue-50 p-6">
          <h3 className="mb-4 text-lg font-semibold">{isAdding ? 'Add New Route' : 'Edit Route'}</h3>

          <div className="grid gap-4 md:grid-cols-2">
            {/* Pickup Location */}
            <div>
              <label className="block text-sm font-medium text-slate-700">
                Pickup Location <span className="text-red-500">*</span>
              </label>
              <div className="mt-1 flex gap-2">
                <input
                  type="text"
                  placeholder="Selected location..."
                  value={formData.pickupLocation}
                  readOnly
                  className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm bg-slate-50 outline-none"
                />
                <button
                  type="button"
                  onClick={() => handleMapPickerOpen('pickup')}
                  className="flex items-center gap-2 rounded-lg bg-[#FF9933] px-3 py-2 text-sm font-semibold text-white hover:bg-[#ff8c1f]"
                >
                  <MapPin className="h-4 w-4" />
                  Map
                </button>
              </div>
              <input
                type="text"
                placeholder="Full address"
                value={formData.pickupAddress}
                onChange={(e) => setFormData({ ...formData, pickupAddress: e.target.value })}
                className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#FF9933]"
              />
            </div>

            {/* Destination */}
            <div>
              <label className="block text-sm font-medium text-slate-700">
                Destination <span className="text-red-500">*</span>
              </label>
              <div className="mt-1 flex gap-2">
                <input
                  type="text"
                  placeholder="Selected location..."
                  value={formData.destinationName}
                  readOnly
                  className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm bg-slate-50 outline-none"
                />
                <button
                  type="button"
                  onClick={() => handleMapPickerOpen('destination')}
                  className="flex items-center gap-2 rounded-lg bg-[#FF9933] px-3 py-2 text-sm font-semibold text-white hover:bg-[#ff8c1f]"
                >
                  <MapPin className="h-4 w-4" />
                  Map
                </button>
              </div>
              <input
                type="text"
                placeholder="Full address"
                value={formData.destinationAddress}
                onChange={(e) => setFormData({ ...formData, destinationAddress: e.target.value })}
                className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#FF9933]"
              />
            </div>

            {/* Distance */}
            <div>
              <label className="block text-sm font-medium text-slate-700">
                Distance (km) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={formData.distanceKm}
                onChange={(e) => setFormData({ ...formData, distanceKm: parseFloat(e.target.value) })}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#FF9933]"
              />
            </div>

            {/* Travel Time */}
            <div>
              <label className="block text-sm font-medium text-slate-700">
                Travel Time (minutes) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={formData.travelTimeMinutes}
                onChange={(e) => setFormData({ ...formData, travelTimeMinutes: parseFloat(e.target.value) })}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#FF9933]"
              />
            </div>

            {/* Estimated Fare */}
            <div>
              <label className="block text-sm font-medium text-slate-700">
                Estimated Fare (₹) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={formData.estimatedFare}
                onChange={(e) => setFormData({ ...formData, estimatedFare: parseFloat(e.target.value) })}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#FF9933]"
              />
            </div>

            {/* Display Order */}
            <div>
              <label className="block text-sm font-medium text-slate-700">Display Order</label>
              <input
                type="number"
                value={formData.displayOrder}
                onChange={(e) => setFormData({ ...formData, displayOrder: parseFloat(e.target.value) })}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#FF9933]"
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="mt-6 flex gap-3">
            <button
              onClick={handleSave}
              className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700"
            >
              Save Route
            </button>
            <button
              onClick={handleCancel}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Routes List */}
      <div className="space-y-3">
        {routes
          .sort((a, b) => a.displayOrder - b.displayOrder)
          .map((route) => (
            <div
              key={route.id}
              className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="mb-3 grid gap-2 md:grid-cols-2">
                <div>
                  <p className="text-xs font-semibold text-slate-500">FROM</p>
                  <p className="font-semibold text-[#1B3A5F]">{route.pickupLocation}</p>
                  <p className="text-xs text-slate-600">{route.pickupAddress}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500">TO</p>
                  <p className="font-semibold text-[#1B3A5F]">{route.destinationName}</p>
                  <p className="text-xs text-slate-600">{route.destinationAddress}</p>
                </div>
              </div>

              <div className="mb-3 grid gap-2 text-sm md:grid-cols-3">
                <div>
                  <span className="font-medium text-slate-600">{route.distanceKm} km</span>
                </div>
                <div>
                  <span className="font-medium text-slate-600">{route.travelTimeMinutes} min</span>
                </div>
                <div>
                  <span className="font-semibold text-[#FF9933]">{formatCurrency(route.estimatedFare)}</span>
                </div>
              </div>

              <div className="flex gap-2 border-t border-slate-100 pt-3">
                <button
                  onClick={() => handleEdit(route)}
                  className="flex items-center gap-1 rounded-lg bg-blue-100 px-3 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-200"
                >
                  <Edit2 className="h-3 w-3" />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(route.id)}
                  className="flex items-center gap-1 rounded-lg bg-red-100 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-200"
                >
                  <Trash2 className="h-3 w-3" />
                  Delete
                </button>
              </div>
            </div>
          ))}
      </div>

      {routes.length === 0 && !isAdding && !editingId && (
        <div className="rounded-lg border-2 border-dashed border-slate-300 p-8 text-center">
          <p className="text-slate-600">No routes added yet. Click "Add Route" to get started.</p>
        </div>
      )}

      <div className="rounded-lg bg-amber-50 p-4 text-sm text-amber-800">
        <p className="font-semibold">📍 Map Picker Integration:</p>
        <p className="mt-1">Click the "Map" button to select pickup and destination locations on the interactive map with Google Places autocomplete.</p>
      </div>

      {/* Map Picker Modal */}
      <MapPickerModal
        isOpen={isMapPickerOpen}
        onClose={() => {
          setIsMapPickerOpen(false);
          setMapPickerType(null);
        }}
        onLocationSelect={handleLocationSelect}
      />
    </div>
  );
}

export default RouteManager;
