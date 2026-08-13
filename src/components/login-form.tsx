'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { loginAction } from '@/server/actions/auth';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

type FormData = z.infer<typeof schema>;

export function LoginForm() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    const formData = new FormData();
    formData.append('email', data.email);
    formData.append('password', data.password);
    const result = await loginAction(formData);
    setLoading(false);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success('Signed in successfully');
      router.push('/');
      router.refresh();
    }
  };

  return (
    <Card>
      <CardContent className='pt-6'>
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
          <div>
            <Label>Email</Label>
            <Input type='email' {...register('email')} placeholder='you@example.com' />
            {errors.email && <p className='text-sm text-red-500 mt-1'>{errors.email.message}</p>}
          </div>
          <div>
            <Label>Password</Label>
            <Input type='password' {...register('password')} placeholder='******' />
            {errors.password && <p className='text-sm text-red-500 mt-1'>{errors.password.message}</p>}
          </div>
          <Button type='submit' className='w-full bg-teal-700 hover:bg-teal-800' disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
          <p className='text-center text-sm text-muted-foreground'>
            Don&apos;t have an account?{' '}
            <Link href='/register' className='text-teal-700 hover:underline'>
              Register as Provider
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
