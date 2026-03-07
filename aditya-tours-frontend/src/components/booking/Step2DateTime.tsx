import { useWatch } from 'react-hook-form';
import type { UseFormReturn } from 'react-hook-form';
import type { BookingFlowInput } from './BookingFlow.tsx';
import DateTimePicker from './DateTimePicker';
import { nowDateString } from '../../utils/dateTime';

interface Step2DateTimeProps {
  form: UseFormReturn<BookingFlowInput>;
}

function Step2DateTime({ form }: Step2DateTimeProps) {
  const tripType = useWatch({ control: form.control, name: 'tripType' });
  const departureDate = useWatch({ control: form.control, name: 'departureDate' });
  const departureTime = useWatch({ control: form.control, name: 'departureTime' });
  const returnDate = useWatch({ control: form.control, name: 'returnDate' });
  const returnTime = useWatch({ control: form.control, name: 'returnTime' });

  return (
    <div className="grid gap-4">
      <DateTimePicker
        dateLabel="Departure Date"
        timeLabel="Departure Time"
        minDate={nowDateString()}
        dateValue={departureDate}
        timeValue={departureTime}
        onDateChange={(value) => {
          form.setValue('departureDate', value, { shouldValidate: true, shouldDirty: true, shouldTouch: true });
        }}
        onTimeChange={(value) => {
          form.setValue('departureTime', value, { shouldValidate: true, shouldDirty: true, shouldTouch: true });
        }}
        dateError={form.formState.errors.departureDate?.message}
        timeError={form.formState.errors.departureTime?.message}
      />

      {tripType === 'ROUND_TRIP' ? (
        <DateTimePicker
          dateLabel="Return Date"
          timeLabel="Return Time"
          minDate={departureDate || nowDateString()}
          dateValue={returnDate || ''}
          timeValue={returnTime || ''}
          onDateChange={(value) => {
            form.setValue('returnDate', value, { shouldValidate: true, shouldDirty: true, shouldTouch: true });
          }}
          onTimeChange={(value) => {
            form.setValue('returnTime', value, { shouldValidate: true, shouldDirty: true, shouldTouch: true });
          }}
          dateError={form.formState.errors.returnDate?.message}
          timeError={form.formState.errors.returnTime?.message}
        />
      ) : null}

      <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">
        Availability will be verified when you continue.
      </div>
    </div>
  );
}

export default Step2DateTime;
