import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Stethoscope, Pill, FlaskConical, MapPin, Calendar, CheckCircle, Users } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

export default async function AdminDashboard() {
  const session = await auth();
  if (session?.user?.role !== 'ADMIN') redirect('/');

  const [
    totalDoctors,
    verifiedDoctors,
    totalPharmacies,
    totalLabs,
    totalChambers,
    totalAppointments,
    pendingDoctors,
    pendingPharmacies,
    pendingLabs,
  ] = await Promise.all([
    prisma.doctor.count(),
    prisma.doctor.count({ where: { status: 'VERIFIED' } }),
    prisma.medicineShop.count(),
    prisma.medicalLab.count(),
    prisma.chamber.count(),
    prisma.appointment.count(),
    prisma.doctor.count({ where: { status: 'PENDING' } }),
    prisma.medicineShop.count({ where: { status: 'PENDING' } }),
    prisma.medicalLab.count({ where: { status: 'PENDING' } }),
  ]);

  const pendingProviders = pendingDoctors + pendingPharmacies + pendingLabs;

  const stats = [
    { label: 'Total Doctors', value: totalDoctors, icon: Stethoscope, color: 'text-blue-600' },
    { label: 'Verified', value: verifiedDoctors, icon: CheckCircle, color: 'text-green-600' },
    { label: 'Pharmacies', value: totalPharmacies, icon: Pill, color: 'text-purple-600' },
    { label: 'Labs', value: totalLabs, icon: FlaskConical, color: 'text-orange-600' },
    { label: 'Chambers', value: totalChambers, icon: MapPin, color: 'text-red-600' },
    { label: 'Appointments', value: totalAppointments, icon: Calendar, color: 'text-teal-600' },
  ];

  return (
    <div className='container py-8'>
      <div className='flex justify-between items-center mb-8'>
        <h1 className='text-3xl font-bold'>Admin Dashboard</h1>
        {pendingProviders > 0 && (
          <Badge variant='destructive' className='text-sm'>
            {pendingProviders} pending approvals
          </Badge>
        )}
      </div>
      <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8'>
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className='p-4 text-center'>
              <stat.icon className={`h-8 w-8 mx-auto mb-2 ${stat.color}`} />
              <p className='text-2xl font-bold'>{stat.value}</p>
              <p className='text-xs text-muted-foreground'>{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <Tabs defaultValue='pending'>
        <TabsList>
          <TabsTrigger value='pending'>Pending</TabsTrigger>
          <TabsTrigger value='doctors'>Doctors</TabsTrigger>
          <TabsTrigger value='pharmacies'>Pharmacies</TabsTrigger>
          <TabsTrigger value='labs'>Labs</TabsTrigger>
          <TabsTrigger value='appointments'>Appointments</TabsTrigger>
          <TabsTrigger value='settings'>Settings</TabsTrigger>
        </TabsList>
        <TabsContent value='pending' className='mt-4'>
          <PendingApprovals />
        </TabsContent>
        <TabsContent value='doctors' className='mt-4'>
          <DoctorsList />
        </TabsContent>
        <TabsContent value='pharmacies' className='mt-4'>
          <PharmaciesList />
        </TabsContent>
        <TabsContent value='labs' className='mt-4'>
          <LabsList />
        </TabsContent>
        <TabsContent value='appointments' className='mt-4'>
          <AppointmentsList />
        </TabsContent>
        <TabsContent value='settings' className='mt-4'>
          <SystemSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
}

async function PendingApprovals() {
  const [doctors, pharmacies, labs] = await Promise.all([
    prisma.doctor.findMany({
      where: { status: 'PENDING' },
      include: { user: { select: { email: true, name: true } } },
    }),
    prisma.medicineShop.findMany({
      where: { status: 'PENDING' },
      include: { user: { select: { email: true, name: true } } },
    }),
    prisma.medicalLab.findMany({
      where: { status: 'PENDING' },
      include: { user: { select: { email: true, name: true } } },
    }),
  ]);

  const doctorPending = doctors.map((d) => ({ ...d, type: 'doctor' as const }));
  const pharmacyPending = pharmacies.map((p) => ({ ...p, type: 'pharmacy' as const }));
  const labPending = labs.map((l) => ({ ...l, type: 'lab' as const }));

  const allPending = [...doctorPending, ...pharmacyPending, ...labPending];

  if (allPending.length === 0)
    return <p className='text-muted-foreground py-8 text-center'>No pending approvals</p>;

  return (
    <div className='space-y-4'>
      {allPending.map((item) => (
        <Card key={item.id}>
          <CardContent className='p-4 flex items-center justify-between'>
            <div>
              <p className='font-semibold'>{item.name}</p>
              <p className='text-sm text-muted-foreground'>
                {item.type === 'doctor' ? 'Doctor' : item.type === 'pharmacy' ? 'Pharmacy' : 'Lab'} - {item.user.email}
              </p>
              <p className='text-sm text-muted-foreground'>
                {'city' in item ? item.city || 'N/A' : 'N/A'}
              </p>
            </div>
            <div className='flex gap-2'>
              <form
                action={async () => {
                  'use server';
                  if (item.type === 'doctor') {
                    await prisma.doctor.update({ where: { id: item.id }, data: { status: 'VERIFIED' } });
                  } else if (item.type === 'pharmacy') {
                    await prisma.medicineShop.update({ where: { id: item.id }, data: { status: 'VERIFIED' } });
                  } else {
                    await prisma.medicalLab.update({ where: { id: item.id }, data: { status: 'VERIFIED' } });
                  }
                  await prisma.user.update({ where: { id: item.userId }, data: { status: 'ACTIVE' } });
                }}
              >
                <Button type='submit' size='sm' className='bg-green-600 hover:bg-green-700'>
                  Approve
                </Button>
              </form>
              <form
                action={async () => {
                  'use server';
                  if (item.type === 'doctor') {
                    await prisma.doctor.update({ where: { id: item.id }, data: { status: 'REJECTED' } });
                  } else if (item.type === 'pharmacy') {
                    await prisma.medicineShop.update({ where: { id: item.id }, data: { status: 'REJECTED' } });
                  } else {
                    await prisma.medicalLab.update({ where: { id: item.id }, data: { status: 'REJECTED' } });
                  }
                }}
              >
                <Button type='submit' size='sm' variant='destructive'>
                  Reject
                </Button>
              </form>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

async function DoctorsList() {
  const doctors = await prisma.doctor.findMany({
    include: { user: { select: { email: true } }, chambers: true },
    orderBy: { createdAt: 'desc' },
    take: 50,
  });
  return (
    <div className='space-y-4'>
      {doctors.map((d) => (
        <Card key={d.id}>
          <CardContent className='p-4 flex items-center justify-between'>
            <div>
              <p className='font-semibold'>{d.name}</p>
              <p className='text-sm text-muted-foreground'>
                {d.qualifications} - {d.chambers.length} chambers
              </p>
              <Badge variant={d.status === 'VERIFIED' ? 'default' : 'secondary'}>{d.status}</Badge>
            </div>
            <Link href={`/doctor/${d.slug}`} target='_blank'>
              <Button size='sm' variant='outline'>
                View
              </Button>
            </Link>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

async function PharmaciesList() {
  const pharmacies = await prisma.medicineShop.findMany({ orderBy: { createdAt: 'desc' }, take: 50 });
  return (
    <div className='space-y-4'>
      {pharmacies.map((p) => (
        <Card key={p.id}>
          <CardContent className='p-4 flex items-center justify-between'>
            <div>
              <p className='font-semibold'>{p.name}</p>
              <p className='text-sm text-muted-foreground'>{p.city}</p>
              <Badge variant={p.status === 'VERIFIED' ? 'default' : 'secondary'}>{p.status}</Badge>
            </div>
            <Link href={`/pharmacy/${p.slug}`} target='_blank'>
              <Button size='sm' variant='outline'>
                View
              </Button>
            </Link>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

async function LabsList() {
  const labs = await prisma.medicalLab.findMany({ orderBy: { createdAt: 'desc' }, take: 50 });
  return (
    <div className='space-y-4'>
      {labs.map((l) => (
        <Card key={l.id}>
          <CardContent className='p-4 flex items-center justify-between'>
            <div>
              <p className='font-semibold'>{l.name}</p>
              <p className='text-sm text-muted-foreground'>{l.city}</p>
              <Badge variant={l.status === 'VERIFIED' ? 'default' : 'secondary'}>{l.status}</Badge>
            </div>
            <Link href={`/lab/${l.slug}`} target='_blank'>
              <Button size='sm' variant='outline'>
                View
              </Button>
            </Link>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

async function AppointmentsList() {
  const appointments = await prisma.appointment.findMany({
    include: { chamber: { include: { doctor: true } } },
    orderBy: { createdAt: 'desc' },
    take: 50,
  });
  return (
    <div className='space-y-4'>
      {appointments.map((apt) => (
        <Card key={apt.id}>
          <CardContent className='p-4'>
            <div className='flex justify-between items-start'>
              <div>
                <p className='font-semibold'>{apt.reference}</p>
                <p className='text-sm text-muted-foreground'>
                  {apt.citizenName} - {apt.citizenPhone}
                </p>
                <p className='text-sm text-muted-foreground'>
                  Dr. {apt.chamber.doctor.name} at {apt.chamber.name}
                </p>
                <p className='text-sm text-muted-foreground'>
                  {apt.appointmentDate.toDateString()} {apt.startTime} - {apt.endTime}
                </p>
              </div>
              <Badge>{apt.status}</Badge>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

async function SystemSettings() {
  const settings = await prisma.systemSetting.findMany();
  return (
    <Card>
      <CardHeader>
        <CardTitle>System Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          action={async (formData: FormData) => {
            'use server';
            const key = formData.get('key') as string;
            const value = formData.get('value') as string;
            await prisma.systemSetting.upsert({
              where: { key },
              update: { value },
              create: { key, value, description: '' },
            });
          }}
          className='space-y-4'
        >
          <div className='grid grid-cols-2 gap-4'>
            <div>
              <Label>Setting Key</Label>
              <Input name='key' placeholder='e.g., appointments_enabled' />
            </div>
            <div>
              <Label>Value</Label>
              <Input name='value' placeholder='true or false' />
            </div>
          </div>
          <Button type='submit'>Update Setting</Button>
        </form>
        <div className='mt-6 space-y-2'>
          {settings.map((s) => (
            <div key={s.id} className='flex justify-between py-2 border-b'>
              <span className='font-medium'>{s.key}</span>
              <Badge variant='outline'>{s.value}</Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
