import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { trackBooking } from '../../services/bookingService';
import Input from '../common/Input';
import { Button } from '../common/Button';
import BookingStatus from './BookingStatus';

const schema = z.object({
  referenceNumber: z.string().min(6),
  email: z.string().email(),
});

type FormValues = z.infer<typeof schema>;

function TrackBooking() {
  const { register, handleSubmit, formState } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const query = useMutation({
    mutationFn: ({ referenceNumber, email }: FormValues) => trackBooking(referenceNumber, email),
  });

  return (
    <div className="grid gap-4">
      <form onSubmit={handleSubmit((values) => query.mutate(values))} className="grid gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <Input
          label="Booking Reference"
          placeholder="ATT-A7K9M2"
          {...register('referenceNumber')}
          error={formState.errors.referenceNumber?.message}
        />
        <Input
          label="Email"
          type="email"
          placeholder="you@example.com"
          {...register('email')}
          error={formState.errors.email?.message}
        />

        <Button type="submit" loading={query.isPending}>
          Track Booking
        </Button>

        {query.isError ? (
          <p className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">Could not fetch booking status. Please verify details.</p>
        ) : null}
      </form>

      {query.data ? <BookingStatus result={query.data} /> : null}
    </div>
  );
}

export default TrackBooking;
