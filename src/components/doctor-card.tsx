import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Star, MapPin, Phone } from "lucide-react";
export function DoctorCard({ doctor }: {
    doctor: any;
}) {
    const primaryChamber = doctor.chambers?.[0];
    return (<Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex gap-4">
          <Avatar className="h-16 w-16 shrink-0">
            <AvatarFallback className="bg-teal-100 text-teal-700 text-lg">
              {doctor.name?.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <Link href={`/doctor/${doctor.slug}`} className="font-semibold text-lg hover:text-teal-700 transition-colors line-clamp-1">
                  {doctor.title} {doctor.name}
                </Link>
                <div className="flex flex-wrap gap-1 mt-1">
                  {doctor.specializations?.slice(0, 3).map((s: any) => (<Badge key={s.specialization.id} variant="secondary" className="text-xs">
                      {s.specialization.name}
                    </Badge>))}
                </div>
              </div>
              {doctor.status === "VERIFIED" && (<Badge className="bg-teal-700 text-white text-xs shrink-0">Verified</Badge>)}
            </div>

            <p className="text-sm text-muted-foreground mt-1">{doctor.qualifications}</p>
            {doctor.experienceYears && (<p className="text-sm text-muted-foreground">{doctor.experienceYears} years experience</p>)}

            <div className="flex flex-wrap gap-3 mt-2 text-sm text-muted-foreground">
              {primaryChamber && (<span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3"/>
                  {primaryChamber.city}
                </span>)}
              {doctor.distance !== undefined && (<span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3"/>
                  {doctor.distance.toFixed(1)} km
                </span>)}
              {doctor.rating > 0 && (<span className="flex items-center gap-1">
                  <Star className="h-3 w-3 fill-amber-400 text-amber-400"/>
                  {doctor.rating.toFixed(1)} ({doctor.reviewCount})
                </span>)}
            </div>

            <div className="flex gap-3 mt-2">
              <Link href={`/doctor/${doctor.slug}`} className="text-sm text-teal-700 font-medium hover:underline">
                View Profile
              </Link>
              {primaryChamber?.phone && (<a href={`tel:${primaryChamber.phone}`} className="text-sm text-teal-700 font-medium hover:underline flex items-center gap-1">
                  <Phone className="h-3 w-3"/> Call
                </a>)}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>);
}
