import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Phone, Clock, Truck } from "lucide-react";
export function PharmacyCard({ pharmacy }: {
    pharmacy: any;
}) {
    return (<Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div className="flex-1 min-w-0">
            <Link href={`/pharmacy/${pharmacy.slug}`} className="font-semibold text-lg hover:text-teal-700 transition-colors line-clamp-1">
              {pharmacy.name}
            </Link>
            <div className="flex flex-wrap gap-2 mt-1">
              {pharmacy.is24Hour && <Badge variant="outline" className="text-xs">24-Hour</Badge>}
              {pharmacy.homeDelivery && (<Badge variant="outline" className="text-xs flex items-center gap-1">
                  <Truck className="h-3 w-3"/> Delivery
                </Badge>)}
              {pharmacy.status === "VERIFIED" && <Badge className="bg-teal-700 text-white text-xs">Verified</Badge>}
            </div>
          </div>
        </div>

        <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{pharmacy.address}</p>

        <div className="flex flex-wrap gap-3 mt-2 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <MapPin className="h-3 w-3"/>
            {pharmacy.city}
          </span>
          {pharmacy.distance !== undefined && (<span className="flex items-center gap-1">
              <MapPin className="h-3 w-3"/>
              {pharmacy.distance.toFixed(1)} km
            </span>)}
          {pharmacy.openingHours && (<span className="flex items-center gap-1">
              <Clock className="h-3 w-3"/>
              {pharmacy.openingHours}
            </span>)}
        </div>

        <div className="flex gap-3 mt-2">
          <Link href={`/pharmacy/${pharmacy.slug}`} className="text-sm text-teal-700 font-medium hover:underline">
            View Details
          </Link>
          {pharmacy.phone && (<a href={`tel:${pharmacy.phone}`} className="text-sm text-teal-700 font-medium hover:underline flex items-center gap-1">
              <Phone className="h-3 w-3"/> Call
            </a>)}
        </div>
      </CardContent>
    </Card>);
}
