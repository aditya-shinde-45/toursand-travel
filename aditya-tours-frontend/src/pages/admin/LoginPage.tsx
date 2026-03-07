import { Navigate, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../hooks/useAuth';
import Input from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { useToast } from '../../hooks/useToast';

interface FormValues {
  username: string;
  password: string;
}

function LoginPage() {
  const { isAuthenticated, login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const form = useForm<FormValues>({
    defaultValues: { username: '', password: '' },
  });

  if (isAuthenticated) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md items-center justify-center px-4 py-10">
      <form
        onSubmit={form.handleSubmit(async (values) => {
          try {
            await login(values.username, values.password);
            showToast('success', 'Welcome back');
            navigate('/admin/dashboard');
          } catch {
            showToast('error', 'Invalid admin credentials');
          }
        })}
        className="w-full rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <h1 className="text-2xl font-semibold">Admin Login</h1>
        <p className="mt-1 text-sm text-slate-600">Secure access for booking management</p>

        <div className="mt-4 grid gap-3">
          <Input label="Username" {...form.register('username', { required: true })} />
          <Input label="Password" type="password" {...form.register('password', { required: true })} />
          <Button type="submit">Login</Button>
        </div>
      </form>
    </div>
  );
}

export default LoginPage;
