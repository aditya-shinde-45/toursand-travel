import type { FieldErrors, UseFormRegister } from 'react-hook-form';
import Input from '../common/Input';
import type { BookingFlowInput } from './BookingFlow.tsx';

interface Step3CustomerInfoProps {
  register: UseFormRegister<BookingFlowInput>;
  errors: FieldErrors<BookingFlowInput>;
}

function Step3CustomerInfo({ register, errors }: Step3CustomerInfoProps) {
  return (
    <div className="grid gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Input label="Full Name" {...register('customerName')} error={errors.customerName?.message} />
        <Input
          label="Phone Number"
          type="tel"
          inputMode="numeric"
          placeholder="9876543210"
          {...register('customerPhone')}
          error={errors.customerPhone?.message}
        />
      </div>

      <Input
        label="Email Address"
        type="email"
        placeholder="your@email.com"
        {...register('customerEmail')}
        error={errors.customerEmail?.message}
      />

      <Input
        label="Number of Passengers (1-7)"
        type="number"
        min={1}
        max={7}
        {...register('passengerCount')}
        error={errors.passengerCount?.message}
      />

      <label className="grid gap-1 text-sm font-medium text-slate-700">
        <span>Special Instructions (Optional)</span>
        <textarea
          className="min-h-28 rounded-lg border border-slate-300 px-3 py-2 outline-none ring-blue-500 transition focus:ring"
          {...register('specialInstructions')}
        />
      </label>

      <input type="text" className="hidden" tabIndex={-1} autoComplete="off" {...register('honeypot')} />
    </div>
  );
}

export default Step3CustomerInfo;
