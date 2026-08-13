import { RegisterForm } from '@/components/register-form';
import { Metadata } from 'next';
export const metadata: Metadata = { title: 'Join as Provider | HealthFind', description: 'Register your practice, pharmacy, or lab on HealthFind' };
export default function RegisterPage() { return (<div className='container flex items-center justify-center min-h-[calc(100vh-200px)] py-12'>      <div className='w-full max-w-lg space-y-6'>        <div className='text-center'>          <h1 className='text-2xl font-bold'>Join as Healthcare Provider</h1>          <p className='text-muted-foreground mt-2'>Register your practice, pharmacy, or lab</p>        </div>        <RegisterForm />      </div>    </div>); }
