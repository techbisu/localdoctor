"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { bookAppointment, getChamberSlots } from "@/server/actions/appointments";
import { toast } from "sonner";

const schema = z.object({
  chamberId: z.string().min(1, "Select a chamber"),
  citizenName: z.string().min(2, "Enter your name"),
  citizenPhone: z.string().min(10, "Enter valid phone number"),
  citizenEmail: z.string().email().optional().or(z.literal("")),
  appointmentDate: z.string().min(1, "Select a date"),
  startTime: z.string().min(1, "Select a time slot"),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export function AppointmentForm({ chambers }: { chambers: any[] }) {
  const [slots, setSlots] = useState<any[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [reference, setReference] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const selectedChamber = watch("chamberId");
  const selectedDate = watch("appointmentDate");

  const loadSlots = async (chamberId: string, date: string) => {
    if (!chamberId || !date) return;
    setLoadingSlots(true);
    const result = await getChamberSlots(chamberId, date);
    setSlots(result);
    setLoadingSlots(false);
  };

  const onSubmit = async (data: FormData) => {
    setSubmitting(true);
    const selectedSlot = slots.find((s) => s.start === data.startTime);
    const result = await bookAppointment({
      ...data,
      endTime: selectedSlot?.end || "",
    });
    setSubmitting(false);

    if (result.error) {
      toast.error(result.error);
    } else {
      setReference(result.reference);
      toast.success("Appointment booked successfully!");
    }
  };

  if (reference) {
    return (
      <div className="text-center py-6">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="font-semibold text-lg mb-2">Appointment Confirmed</h3>
        <p className="text-muted-foreground mb-4">Your reference number:</p>
        <p className="text-2xl font-bold text-teal-700 mb-4 font-mono">{reference}</p>
        <Button variant="outline" onClick={() => setReference(null)}>
          Book Another
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label>Select Chamber</Label>
        <Select onValueChange={(v) => { setValue("chamberId", v); if (selectedDate) loadSlots(v, selectedDate); }}>
          <SelectTrigger>
            <SelectValue placeholder="Choose a chamber" />
          </SelectTrigger>
          <SelectContent>
            {chambers.filter((c: any) => c.appointmentEnabled).map((chamber: any) => (
              <SelectItem key={chamber.id} value={chamber.id}>
                {chamber.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.chamberId && <p className="text-sm text-red-500 mt-1">{errors.chamberId.message}</p>}
      </div>

      <div>
        <Label>Date</Label>
        <Input
          type="date"
          min={new Date().toISOString().split("T")[0]}
          {...register("appointmentDate")}
          onChange={(e) => {
            setValue("appointmentDate", e.target.value);
            if (selectedChamber) loadSlots(selectedChamber, e.target.value);
          }}
        />
      </div>

      {selectedChamber && selectedDate && (
        <div>
          <Label>Available Slots</Label>
          {loadingSlots ? (
            <p className="text-sm text-muted-foreground">Loading slots...</p>
          ) : slots.length === 0 ? (
            <p className="text-sm text-muted-foreground">No slots available for this date</p>
          ) : (
            <div className="grid grid-cols-3 gap-2 mt-2">
              {slots.map((slot: any) => (
                <button
                  key={slot.start}
                  type="button"
                  disabled={!slot.available}
                  onClick={() => setValue("startTime", slot.start)}
                  className={`p-2 text-xs rounded border transition-colors ${
                    watch("startTime") === slot.start
                      ? "bg-teal-700 text-white border-teal-700"
                      : slot.available
                      ? "hover:border-teal-500 bg-white"
                      : "bg-gray-100 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  {slot.start}
                </button>
              ))}
            </div>
          )}
          {errors.startTime && <p className="text-sm text-red-500 mt-1">{errors.startTime.message}</p>}
        </div>
      )}

      <div>
        <Label>Your Name</Label>
        <Input {...register("citizenName")} placeholder="Full name" />
        {errors.citizenName && <p className="text-sm text-red-500 mt-1">{errors.citizenName.message}</p>}
      </div>

      <div>
        <Label>Phone Number</Label>
        <Input {...register("citizenPhone")} placeholder="Mobile number" />
        {errors.citizenPhone && <p className="text-sm text-red-500 mt-1">{errors.citizenPhone.message}</p>}
      </div>

      <div>
        <Label>Email (optional)</Label>
        <Input {...register("citizenEmail")} placeholder="Email address" />
      </div>

      <div>
        <Label>Notes (optional)</Label>
        <Input {...register("notes")} placeholder="Any special requests" />
      </div>

      <Button type="submit" className="w-full bg-teal-700 hover:bg-teal-800" disabled={submitting}>
        {submitting ? "Booking..." : "Book Appointment"}
      </Button>
    </form>
  );
}
