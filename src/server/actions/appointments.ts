"use server";

import { prisma } from "@/lib/prisma";
import { z } from "zod";

const bookingSchema = z.object({
  chamberId: z.string(),
  citizenName: z.string().min(2),
  citizenPhone: z.string().min(10),
  citizenEmail: z.string().email().optional().or(z.literal("")),
  appointmentDate: z.string(),
  startTime: z.string(),
  endTime: z.string(),
  notes: z.string().optional(),
});

export async function bookAppointment(data: z.infer<typeof bookingSchema>) {
  const parsed = bookingSchema.safeParse(data);
  if (!parsed.success) return { error: "Invalid booking data" };

  const setting = await prisma.systemSetting.findUnique({
    where: { key: "appointments_enabled" },
  });

  if (setting?.value === "false") {
    return { error: "Appointments are currently disabled" };
  }

  const chamber = await prisma.chamber.findUnique({
    where: { id: parsed.data.chamberId },
  });

  if (!chamber || !chamber.appointmentEnabled) {
    return { error: "This chamber does not accept appointments" };
  }

  const existing = await prisma.appointment.findFirst({
    where: {
      chamberId: parsed.data.chamberId,
      appointmentDate: new Date(parsed.data.appointmentDate),
      startTime: parsed.data.startTime,
      status: { in: ["PENDING", "CONFIRMED"] },
    },
  });

  if (existing) {
    return { error: "This slot is already booked" };
  }

  const ref = `APT-${new Date().getFullYear()}-${Math.floor(Math.random() * 900000 + 100000)}`;

  const appointment = await prisma.appointment.create({
    data: {
      reference: ref,
      chamberId: parsed.data.chamberId,
      citizenName: parsed.data.citizenName,
      citizenPhone: parsed.data.citizenPhone,
      citizenEmail: parsed.data.citizenEmail || null,
      appointmentDate: new Date(parsed.data.appointmentDate),
      startTime: parsed.data.startTime,
      endTime: parsed.data.endTime,
      notes: parsed.data.notes,
    },
  });

  await prisma.appointmentStatusHistory.create({
    data: {
      appointmentId: appointment.id,
      status: "PENDING",
      notes: "Appointment created",
    },
  });

  return { success: true, reference: ref, appointment };
}

export async function getChamberSlots(chamberId: string, date: string) {
  const dayOfWeek = new Date(date).toLocaleDateString("en-US", { weekday: "long" }).toUpperCase();

  const schedules = await prisma.chamberSchedule.findMany({
    where: {
      chamberId,
      day: dayOfWeek as any,
      isActive: true,
    },
  });

  const holidays = await prisma.chamberHoliday.findFirst({
    where: {
      chamberId,
      date: new Date(date),
    },
  });

  if (holidays) return [];

  const existingAppointments = await prisma.appointment.findMany({
    where: {
      chamberId,
      appointmentDate: new Date(date),
      status: { in: ["PENDING", "CONFIRMED"] },
    },
  });

  const slots: { start: string; end: string; available: boolean }[] = [];

  for (const schedule of schedules) {
    let current = schedule.startTime;
    while (current < schedule.endTime) {
      const [h, m] = current.split(":").map(Number);
      const endH = h + Math.floor((m + 15) / 60);
      const endM = (m + 15) % 60;
      const endTime = `${String(endH).padStart(2, "0")}:${String(endM).padStart(2, "0")}`;

      const taken = existingAppointments.some(
        (a) => a.startTime === current && a.endTime === endTime
      );

      slots.push({ start: current, end: endTime, available: !taken });
      current = endTime;
    }
  }

  return slots;
}
