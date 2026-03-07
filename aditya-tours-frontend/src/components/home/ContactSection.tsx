import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { contactSchema } from '../../utils/validation';
import { submitContact } from '../../services/contentService';
import { SUPPORT_PHONE } from '../../utils/constants';
import Input from '../common/Input';
import { Button } from '../common/Button';
import type { z } from 'zod';

type ContactValues = z.infer<typeof contactSchema>;

function ContactSection() {
  const form = useForm<ContactValues>({
    resolver: zodResolver(contactSchema),
  });

  const mutation = useMutation({
    mutationFn: submitContact,
  });

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-semibold">Contact Us</h2>
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <article className="text-sm text-slate-700">
          <p>Call now for quick booking help:</p>
          <a className="mt-2 inline-block text-lg font-semibold text-blue-700" href={`tel:${SUPPORT_PHONE}`}>
            {SUPPORT_PHONE}
          </a>
          <p className="mt-2">Business Hours: 24/7 for confirmed rides</p>
          <p>Expected response: within 2 hours</p>
        </article>

        <form className="grid gap-3" onSubmit={form.handleSubmit((values) => mutation.mutate(values))}>
          <Input label="Name" {...form.register('name')} error={form.formState.errors.name?.message} />
          <Input label="Email" type="email" {...form.register('email')} error={form.formState.errors.email?.message} />
          <Input label="Phone" type="tel" {...form.register('phone')} error={form.formState.errors.phone?.message} />
          <label className="grid gap-1 text-sm font-medium text-slate-700">
            <span>Message</span>
            <textarea className="min-h-24 rounded-lg border border-slate-300 px-3 py-2" {...form.register('message')} />
            {form.formState.errors.message ? <span className="text-xs text-red-600">{form.formState.errors.message.message}</span> : null}
          </label>
          <Button type="submit" loading={mutation.isPending}>Send Inquiry</Button>
          {mutation.isSuccess ? (
            <p className="rounded-lg border border-emerald-200 bg-emerald-50 p-2 text-xs text-emerald-700">
              Inquiry submitted. Our team will contact you soon.
            </p>
          ) : null}
        </form>
      </div>
    </section>
  );
}

export default ContactSection;
