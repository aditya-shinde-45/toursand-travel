import { useState } from 'react';
import { useForm } from 'react-hook-form';
import type { z } from 'zod';
import { bookingSchema } from '../../utils/validation';
import { Button } from '../common/Button';
import Step1Location from './Step1Location';
import Step2DateTime from './Step2DateTime';
import Step3CustomerInfo from './Step3CustomerInfo';
import Step4Summary from './Step4Summary';
import { useToast } from '../../hooks/useToast';

export type BookingFlowInput = z.input<typeof bookingSchema>;
export type BookingFlowValues = z.output<typeof bookingSchema>;

function BookingFlow() {
  const [referenceNumber, setReferenceNumber] = useState('');
  const { showToast } = useToast();

  const form = useForm<BookingFlowInput>({
    defaultValues: {
      pickupLocation: { address: '', lat: 19.2183, lng: 72.9781 },
      dropLocation: { address: '', lat: 19.076, lng: 72.8777 },
      tripType: 'ONE_WAY',
      departureDate: '',
      departureTime: '',
      returnDate: '',
      returnTime: '',
      customerName: '',
      customerPhone: '',
      customerEmail: '',
      passengerCount: 1,
      specialInstructions: '',
      distanceKm: 0,
      travelTimeMinutes: 0,
      agreeTerms: false,
      honeypot: '',
    },
    mode: 'onBlur',
    reValidateMode: 'onChange',
  });

  const values = form.watch();

  const onConfirmBooking = form.handleSubmit(async (data) => {
    // Mock booking submission until backend is ready
    const mockRef = 'BK' + Date.now().toString().slice(-8);
    setReferenceNumber(mockRef);
    showToast('success', `Booking submitted. Reference: ${mockRef}`);
    console.log('Booking data:', data);
    
    // Uncomment when backend is ready:
    // const result = await booking.mutateAsync({
    //   pickupLocation: data.pickupLocation,
    //   dropLocation: data.dropLocation,
    //   tripType: data.tripType,
    //   departureDate: data.departureDate,
    //   departureTime: data.departureTime,
    //   returnDate: data.returnDate ?? '',
    //   returnTime: data.returnTime ?? '',
    //   customerName: data.customerName,
    //   customerPhone: data.customerPhone,
    //   customerEmail: data.customerEmail,
    //   passengerCount: Number(data.passengerCount),
    //   specialInstructions: data.specialInstructions ?? '',
    //   distanceKm: Number(data.distanceKm),
    //   travelTimeMinutes: Number(data.travelTimeMinutes),
    //   agreeTerms: data.agreeTerms,
    //   honeypot: data.honeypot ?? '',
    // });
    // setReferenceNumber(result.referenceNumber);
    // showToast('success', `Booking submitted. Reference: ${result.referenceNumber}`);
  });

  if (referenceNumber) {
    return (
      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-6">
        <h3 className="text-xl font-semibold text-emerald-800">Booking Request Submitted</h3>
        <p className="mt-2 text-sm text-emerald-800">Reference Number: <strong>{referenceNumber}</strong></p>
        <p className="mt-1 text-sm text-emerald-700">Admin will confirm your booking and send email updates.</p>
      </div>
    );
  }

  return (
    <form onSubmit={onConfirmBooking} className="grid gap-5">
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900">1) Trip Location</h3>
        <div className="mt-4">
          <Step1Location form={form} />
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900">2) Date & Time</h3>
        <div className="mt-4">
          <Step2DateTime form={form} />
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900">3) Customer Details</h3>
        <div className="mt-4">
          <Step3CustomerInfo register={form.register} errors={form.formState.errors} />
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900">4) Booking Summary</h3>
        <div className="mt-4">
          <Step4Summary
            values={values}
            onAgreeChange={(value: boolean) => form.setValue('agreeTerms', value, { shouldDirty: true, shouldTouch: true })}
          />
        </div>
      </div>

      {form.formState.errors.agreeTerms ? (
        <p className="text-sm text-red-600">{form.formState.errors.agreeTerms.message}</p>
      ) : null}

      <div className="flex flex-wrap gap-3">
        <Button type="submit">Confirm Booking</Button>
      </div>
    </form>
  );
}

export default BookingFlow;
