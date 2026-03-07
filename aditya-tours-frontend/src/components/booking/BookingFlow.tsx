import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import type { z } from 'zod';
import { bookingSchema } from '../../utils/validation';
import { Button } from '../common/Button';
import Step1Location from './Step1Location';
import Step2DateTime from './Step2DateTime';
import Step3CustomerInfo from './Step3CustomerInfo';
import Step4Summary from './Step4Summary';
import { useToast } from '../../hooks/useToast';
import { trackBookingStep } from '../../services/analyticsService';

export type BookingFlowInput = z.input<typeof bookingSchema>;
export type BookingFlowValues = z.output<typeof bookingSchema>;

const stepTitles = ['Location', 'Date & Time', 'Customer Details', 'Summary'];

const stepFields: Array<(keyof BookingFlowInput)[]> = [
  ['pickupLocation', 'dropLocation', 'tripType', 'distanceKm', 'travelTimeMinutes'],
  ['departureDate', 'departureTime', 'returnDate', 'returnTime'],
  ['customerName', 'customerPhone', 'customerEmail', 'passengerCount'],
  ['agreeTerms'],
];

function BookingFlow() {
  const [step, setStep] = useState(1);
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

  const isFinalStep = step === 4;

  const values = form.watch();

  console.log('🔄 BookingFlow state:', {
    currentStep: step,
    formValues: values,
    formErrors: form.formState.errors,
    isDirty: form.formState.isDirty,
  });

  const canShowStep = useMemo(
    () => ({
      one: step === 1,
      two: step === 2,
      three: step === 3,
      four: step === 4,
    }),
    [step],
  );

  const onNext = async () => {
    console.log('▶️ Continue clicked - validating step', step, 'fields:', stepFields[step - 1]);
    const valid = await form.trigger(stepFields[step - 1]);
    console.log('✅ Validation result:', valid, 'Form errors:', form.formState.errors);
    if (!valid) return;

    // Skip availability check until backend is ready
    // if (step === 2) {
    //   const data = form.getValues();
    //   const result = await availability.mutateAsync({
    //     departureDatetime: toIsoDateTime(data.departureDate, data.departureTime),
    //     returnDatetime: data.tripType === 'ROUND_TRIP' ? toIsoDateTime(data.returnDate ?? '', data.returnTime ?? '') : undefined,
    //     travelTimeMinutes: Number(data.travelTimeMinutes),
    //   });

    //   if (!result.available) {
    //     showToast('error', result.reason || 'Vehicle is unavailable for selected slot.');
    //     return;
    //   }
    // }

    setStep((current) => Math.min(4, current + 1));
    trackBookingStep(Math.min(4, step + 1));
  };

  const onBack = () => setStep((current) => Math.max(1, current - 1));

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
      <div className="grid gap-2 sm:grid-cols-4">
        {stepTitles.map((title, index) => {
          const item = index + 1;
          const active = item === step;
          const done = item < step;
          return (
            <div
              key={title}
              className={`rounded-lg border p-3 text-sm ${
                active
                  ? 'border-blue-300 bg-blue-50 text-blue-800'
                  : done
                    ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                    : 'border-slate-200 bg-white text-slate-600'
              }`}
            >
              Step {item}: {title}
            </div>
          );
        })}
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        {canShowStep.one ? (
          <Step1Location form={form} />
        ) : null}
        {canShowStep.two ? (
          <Step2DateTime form={form} />
        ) : null}
        {canShowStep.three ? (
          <Step3CustomerInfo register={form.register} errors={form.formState.errors} />
        ) : null}
        {canShowStep.four ? (
          <Step4Summary
            values={values}
            onAgreeChange={(value: boolean) => form.setValue('agreeTerms', value, { shouldDirty: true, shouldTouch: true })}
          />
        ) : null}
      </div>

      {form.formState.errors.agreeTerms ? (
        <p className="text-sm text-red-600">{form.formState.errors.agreeTerms.message}</p>
      ) : null}

      <div className="flex flex-wrap gap-3">
        {step > 1 ? (
          <Button type="button" variant="outline" onClick={onBack}>
            Back
          </Button>
        ) : null}

        {!isFinalStep ? (
          <Button type="button" onClick={onNext}>
            Continue
          </Button>
        ) : (
          <Button type="submit">
            Confirm Booking
          </Button>
        )}
      </div>
    </form>
  );
}

export default BookingFlow;
