"use server";

import { prisma } from "@/lib/prisma";

function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export async function searchHealthcare(params: {
  query?: string;
  type?: string;
  lat?: number;
  lng?: number;
  radius?: number;
  city?: string;
  specialization?: string;
  page?: number;
  limit?: number;
}) {
  const {
    query,
    type = "all",
    lat,
    lng,
    radius = 10,
    city,
    specialization,
    page = 1,
    limit = 12,
  } = params;

  const skip = (page - 1) * limit;
  const results: any[] = [];

  if (type === "all" || type === "doctor") {
    const doctors = await prisma.doctor.findMany({
      where: {
        status: "VERIFIED",
        ...(query && {
          OR: [
            { name: { contains: query, mode: "insensitive" } },
            { about: { contains: query, mode: "insensitive" } },
            { qualifications: { contains: query, mode: "insensitive" } },
          ],
        }),
        ...(specialization && {
          specializations: {
            some: {
              specialization: { slug: specialization },
            },
          },
        }),
        ...(city && { chambers: { some: { city: { contains: city, mode: "insensitive" } } } }),
      },
      include: {
        specializations: { include: { specialization: true } },
        chambers: true,
        user: { select: { email: true } },
      },
      take: limit,
      skip,
    });

    for (const doctor of doctors) {
      let distance: number | undefined;
      if (lat && lng && doctor.chambers[0]?.latitude) {
        distance = haversineDistance(
          lat,
          lng,
          doctor.chambers[0].latitude,
          doctor.chambers[0].longitude || 0
        );
      }
      if (!distance || distance <= radius) {
        results.push({ ...doctor, type: "doctor", distance });
      }
    }
  }

  if (type === "all" || type === "pharmacy") {
    const pharmacies = await prisma.medicineShop.findMany({
      where: {
        status: "VERIFIED",
        ...(query && {
          OR: [
            { name: { contains: query, mode: "insensitive" } },
            { address: { contains: query, mode: "insensitive" } },
          ],
        }),
        ...(city && { city: { contains: city, mode: "insensitive" } }),
      },
      take: limit,
      skip,
    });

    for (const pharmacy of pharmacies) {
      let distance: number | undefined;
      if (lat && lng && pharmacy.latitude) {
        distance = haversineDistance(lat, lng, pharmacy.latitude, pharmacy.longitude || 0);
      }
      if (!distance || distance <= radius) {
        results.push({ ...pharmacy, type: "pharmacy", distance });
      }
    }
  }

  if (type === "all" || type === "lab") {
    const labs = await prisma.medicalLab.findMany({
      where: {
        status: "VERIFIED",
        ...(query && {
          OR: [
            { name: { contains: query, mode: "insensitive" } },
            { address: { contains: query, mode: "insensitive" } },
          ],
        }),
        ...(city && { city: { contains: city, mode: "insensitive" } }),
      },
      include: { services: { include: { service: true } } },
      take: limit,
      skip,
    });

    for (const lab of labs) {
      let distance: number | undefined;
      if (lat && lng && lab.latitude) {
        distance = haversineDistance(lat, lng, lab.latitude, lab.longitude || 0);
      }
      if (!distance || distance <= radius) {
        results.push({ ...lab, type: "lab", distance });
      }
    }
  }

  results.sort((a, b) => {
    if (a.distance !== undefined && b.distance !== undefined) {
      return a.distance - b.distance;
    }
    return 0;
  });

  return results;
}

export async function getSpecializations() {
  return prisma.specialization.findMany({
    where: { status: true },
    orderBy: { sortOrder: "asc" },
  });
}

export async function getMedicalProblems() {
  return prisma.medicalProblem.findMany({
    where: { status: true },
    include: { specializations: { include: { specialization: true } } },
  });
}
