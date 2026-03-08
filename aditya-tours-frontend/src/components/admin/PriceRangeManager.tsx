import { useEffect, useMemo, useState } from 'react';
import { Button } from '../common/Button';
import Input from '../common/Input';
import { fetchAdminPricingRanges, updateAdminPricingRanges } from '../../services/adminService';
import { useToast } from '../../hooks/useToast';

interface PriceRangeItem {
  id: string;
  fromKm: number;
  toKm: number;
  price: number;
  displayOrder: number;
}

interface PriceRangesSectionData {
  title: string;
  subtitle: string;
  ranges: PriceRangeItem[];
}

const DEFAULT_PRICE_RANGES: PriceRangesSectionData = {
  title: 'Distance Based Price Ranges',
  subtitle: 'Set fare by distance slab (from km to km).',
  ranges: [
    { id: '1', fromKm: 0, toKm: 20, price: 1200, displayOrder: 1 },
    { id: '2', fromKm: 21, toKm: 40, price: 2000, displayOrder: 2 },
    { id: '3', fromKm: 41, toKm: 80, price: 3200, displayOrder: 3 },
  ],
};

function normalizePriceRanges(data: unknown): PriceRangesSectionData {
  if (!data || typeof data !== 'object') {
    return DEFAULT_PRICE_RANGES;
  }

  const raw = data as Record<string, unknown>;
  const rangesRaw = Array.isArray(raw.ranges) ? raw.ranges : [];

  const ranges: PriceRangeItem[] = rangesRaw
    .map((item, index) => {
      if (!item || typeof item !== 'object') return null;
      const row = item as Record<string, unknown>;
      return {
        id: String(row.id ?? crypto.randomUUID()),
        fromKm: Number(row.fromKm ?? row.from_km ?? 0),
        toKm: Number(row.toKm ?? row.to_km ?? 0),
        price: Number(row.price ?? 0),
        displayOrder: Number(row.displayOrder ?? row.display_order ?? index + 1),
      };
    })
    .filter((item): item is PriceRangeItem => item !== null)
    .sort((a, b) => a.displayOrder - b.displayOrder);

  return {
    title: String(raw.title ?? DEFAULT_PRICE_RANGES.title),
    subtitle: String(raw.subtitle ?? DEFAULT_PRICE_RANGES.subtitle),
    ranges: ranges.length > 0 ? ranges : DEFAULT_PRICE_RANGES.ranges,
  };
}

function PriceRangeManager() {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<PriceRangesSectionData>(DEFAULT_PRICE_RANGES);

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      try {
        setLoading(true);
        const section = await fetchAdminPricingRanges();
        if (!isMounted) return;
        setForm(normalizePriceRanges(section));
      } catch {
        if (!isMounted) return;
        setForm(DEFAULT_PRICE_RANGES);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    load();

    return () => {
      isMounted = false;
    };
  }, []);

  const isValid = useMemo(() => {
    if (!form.title.trim() || !form.subtitle.trim()) return false;
    if (form.ranges.length === 0) return false;

    return form.ranges.every((range) => range.fromKm >= 0 && range.toKm >= range.fromKm && range.price > 0);
  }, [form]);

  const updateRange = (index: number, patch: Partial<PriceRangeItem>) => {
    setForm((prev) => ({
      ...prev,
      ranges: prev.ranges.map((range, i) =>
        i === index ? { ...range, ...patch, displayOrder: i + 1 } : { ...range, displayOrder: i + 1 },
      ),
    }));
  };

  const addRange = () => {
    setForm((prev) => {
      const nextIndex = prev.ranges.length + 1;
      const lastToKm = prev.ranges.length > 0 ? prev.ranges[prev.ranges.length - 1].toKm : 0;

      return {
        ...prev,
        ranges: [
          ...prev.ranges,
          {
            id: crypto.randomUUID(),
            fromKm: lastToKm + 1,
            toKm: lastToKm + 10,
            price: 1000,
            displayOrder: nextIndex,
          },
        ],
      };
    });
  };

  const removeRange = (index: number) => {
    setForm((prev) => ({
      ...prev,
      ranges: prev.ranges
        .filter((_, i) => i !== index)
        .map((range, i) => ({
          ...range,
          displayOrder: i + 1,
        })),
    }));
  };

  const handleSave = async () => {
    if (!isValid) {
      showToast('error', 'Please fill valid title, subtitle, and ranges');
      return;
    }

    try {
      setSaving(true);
      const payload: PriceRangesSectionData = {
        title: form.title.trim(),
        subtitle: form.subtitle.trim(),
        ranges: form.ranges.map((range, index) => ({
          ...range,
          displayOrder: index + 1,
        })),
      };

      await updateAdminPricingRanges(payload);
      showToast('success', 'Price ranges saved to database');
    } catch {
      showToast('error', 'Failed to save price ranges');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setForm(DEFAULT_PRICE_RANGES);
    showToast('info', 'Reset to default values (click Save to persist)');
  };

  return (
    <div className="grid gap-4">
      <div>
        <h2 className="text-xl font-semibold text-slate-900">Price Range Management</h2>
        <p className="text-sm text-slate-600">Create km-to-km slabs with fixed price and save to database.</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Input
          label="Section Title"
          value={form.title}
          onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
          placeholder="Distance Based Price Ranges"
          disabled={loading || saving}
        />
        <Input
          label="Section Subtitle"
          value={form.subtitle}
          onChange={(event) => setForm((prev) => ({ ...prev, subtitle: event.target.value }))}
          placeholder="Set fare by distance slab"
          disabled={loading || saving}
        />
      </div>

      <div className="grid gap-3">
        {form.ranges.map((range, index) => (
          <div key={range.id} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-700">Range {index + 1}</p>
              <button
                type="button"
                onClick={() => removeRange(index)}
                className="text-xs font-medium text-red-600 hover:text-red-700"
                disabled={loading || saving || form.ranges.length <= 1}
              >
                Remove
              </button>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <Input
                label="From Km"
                type="number"
                min={0}
                value={String(range.fromKm)}
                onChange={(event) => updateRange(index, { fromKm: Number(event.target.value) || 0 })}
                disabled={loading || saving}
              />
              <Input
                label="To Km"
                type="number"
                min={0}
                value={String(range.toKm)}
                onChange={(event) => updateRange(index, { toKm: Number(event.target.value) || 0 })}
                disabled={loading || saving}
              />
              <Input
                label="Price (₹)"
                type="number"
                min={0}
                value={String(range.price)}
                onChange={(event) => updateRange(index, { price: Number(event.target.value) || 0 })}
                disabled={loading || saving}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        <Button type="button" variant="outline" onClick={addRange} disabled={loading || saving}>
          Add Range
        </Button>
        <Button type="button" onClick={handleSave} disabled={loading || saving || !isValid} loading={saving}>
          Save Price Ranges
        </Button>
        <Button type="button" variant="outline" onClick={handleReset} disabled={loading || saving}>
          Reset
        </Button>
      </div>
    </div>
  );
}

export default PriceRangeManager;
