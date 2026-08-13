import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Phone, Home } from "lucide-react";
export function LabCard({ lab }: {
    lab: any;
}) {
    return (<Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div className="flex-1 min-w-0">
            <Link href={`/lab/${lab.slug}`} className="font-semibold text-lg hover:text-teal-700 transition-colors line-clamp-1">
              {lab.name}
            </Link>
            <div className="flex flex-wrap gap-2 mt-1">
              {lab.homeSampleCollection && (<Badge variant="outline" className="text-xs flex items-center gap-1">
                  <Home className="h-3 w-3"/> Home Sample
                </Badge>)}
              {lab.status === "VERIFIED" && (<Badge className="bg-teal-700 text-white text-xs">Verified</Badge>)}
            </div>
          </div>
        </div>

        <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{lab.address}</p>

        {lab.services?.length > 0 && (<div className="flex flex-wrap gap-1 mt-2">
            {lab.services.slice(0, 4).map((s: any) => (<Badge key={s.service.id} variant="secondary" className="text-xs">
                {s.service.name}
              </Badge>))}
          </div>)}

        <div className="flex flex-wrap gap-3 mt-2 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <MapPin className="h-3 w-3"/>
            {lab.city}
          </span>
          {lab.distance !== undefined && (<span className="flex items-center gap-1">
              <MapPin className="h-3 w-3"/>
              {lab.distance.toFixed(1)} km
            </span>)}
        </div>

        <div className="flex gap-3 mt-2">
          <Link href={`/lab/${lab.slug}`} className="text-sm text-teal-700 font-medium hover:underline">
            View Details
          </Link>
          {lab.phone && (<a href={`tel:${lab.phone}`} className="text-sm text-teal-700 font-medium hover:underline flex items-center gap-1">
              <Phone className="h-3 w-3"/> Call
            </a>)}
        </div>
      </CardContent>
    </Card>);
}
