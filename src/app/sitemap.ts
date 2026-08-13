import { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  let doctors: { slug: string; updatedAt: Date }[] = [];
  let pharmacies: { slug: string; updatedAt: Date }[] = [];
  let labs: { slug: string; updatedAt: Date }[] = [];
  let specializations: { slug: string }[] = [];

  try {
    [doctors, pharmacies, labs, specializations] = await Promise.all([
      prisma.doctor.findMany({ where: { status: 'VERIFIED' }, select: { slug: true, updatedAt: true } }),
      prisma.medicineShop.findMany({ where: { status: 'VERIFIED' }, select: { slug: true, updatedAt: true } }),
      prisma.medicalLab.findMany({ where: { status: 'VERIFIED' }, select: { slug: true, updatedAt: true } }),
      prisma.specialization.findMany({ where: { status: true }, select: { slug: true } }),
    ]);
  } catch {
    // Database not available during build — return static routes only
  }

  const routes: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${baseUrl}/search`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/login`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
    { url: `${baseUrl}/register`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
    { url: `${baseUrl}/privacy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${baseUrl}/terms`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${baseUrl}/disclaimer`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
  ];

  for (const spec of specializations) {
    routes.push({ url: `${baseUrl}/search?type=doctor&specialization=${spec.slug}`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 });
  }
  for (const doctor of doctors) {
    routes.push({ url: `${baseUrl}/doctor/${doctor.slug}`, lastModified: doctor.updatedAt, changeFrequency: 'weekly', priority: 0.8 });
  }
  for (const pharmacy of pharmacies) {
    routes.push({ url: `${baseUrl}/pharmacy/${pharmacy.slug}`, lastModified: pharmacy.updatedAt, changeFrequency: 'weekly', priority: 0.7 });
  }
  for (const lab of labs) {
    routes.push({ url: `${baseUrl}/lab/${lab.slug}`, lastModified: lab.updatedAt, changeFrequency: 'weekly', priority: 0.7 });
  }

  return routes;
}
