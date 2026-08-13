"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { signIn } from "@/lib/auth";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(["DOCTOR", "PHARMACY", "LAB"]),
  entityName: z.string().min(2),
  phone: z.string().optional(),
  city: z.string().min(2),
  address: z.string().min(5),
});

export async function loginAction(formData: FormData) {
  const data = Object.fromEntries(formData);
  const parsed = loginSchema.safeParse(data);
  if (!parsed.success) return { error: "Invalid credentials" };

  try {
    await signIn("credentials", {
      email: parsed.data.email,
      password: parsed.data.password,
      redirectTo: "/",
    });
    return { success: true };
  } catch (error: any) {
    if (error.type === "CredentialsSignin") return { error: "Invalid credentials" };
    if (error.message?.includes("NEXT_REDIRECT")) throw error;
    return { error: "Something went wrong" };
  }
}

export async function registerAction(formData: FormData) {
  const data = Object.fromEntries(formData);
  const parsed = registerSchema.safeParse(data);
  if (!parsed.success) return { error: "Invalid data" };

  const existing = await prisma.user.findUnique({
    where: { email: parsed.data.email },
  });
  if (existing) return { error: "Email already registered" };

  const hashedPassword = await bcrypt.hash(parsed.data.password, 10);

  const user = await prisma.user.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email,
      password: hashedPassword,
      role: parsed.data.role,
      phone: parsed.data.phone,
      status: "PENDING",
    },
  });

  const slugBase = parsed.data.entityName.toLowerCase().replace(/\s+/g, "-");
  const slugSuffix = user.id.slice(0, 6);

  if (parsed.data.role === "DOCTOR") {
    await prisma.doctor.create({
      data: {
        userId: user.id,
        name: parsed.data.entityName,
        slug: `dr-${slugBase}-${slugSuffix}`,
        phone: parsed.data.phone,
      },
    });
  } else if (parsed.data.role === "PHARMACY") {
    await prisma.medicineShop.create({
      data: {
        userId: user.id,
        name: parsed.data.entityName,
        slug: `${slugBase}-${slugSuffix}`,
        phone: parsed.data.phone,
        city: parsed.data.city,
        address: parsed.data.address,
      },
    });
  } else if (parsed.data.role === "LAB") {
    await prisma.medicalLab.create({
      data: {
        userId: user.id,
        name: parsed.data.entityName,
        slug: `${slugBase}-${slugSuffix}`,
        phone: parsed.data.phone,
        city: parsed.data.city,
        address: parsed.data.address,
      },
    });
  }

  return { success: true };
}
