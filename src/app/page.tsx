import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SearchBox } from "@/components/search-box";
import { Stethoscope, Pill, FlaskConical, MapPin, Calendar, Shield } from "lucide-react";
export default function Home() {
    return (<div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-teal-700 text-white py-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Find Healthcare Near You
          </h1>
          <p className="text-lg md:text-xl text-teal-100 mb-8 max-w-2xl mx-auto">
            Discover trusted doctors, pharmacies, and diagnostic labs in your locality. Book appointments and access quality care.
          </p>
          <div className="max-w-xl mx-auto mb-8">
            <SearchBox />
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/search?type=doctor">
              <Button variant="secondary" className="gap-2">
                <Stethoscope className="h-4 w-4"/> Find Doctors
              </Button>
            </Link>
            <Link href="/search?type=pharmacy">
              <Button variant="secondary" className="gap-2">
                <Pill className="h-4 w-4"/> Find Pharmacies
              </Button>
            </Link>
            <Link href="/search?type=lab">
              <Button variant="secondary" className="gap-2">
                <FlaskConical className="h-4 w-4"/> Find Labs
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-background">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Why HealthFind?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-xl border bg-card">
              <MapPin className="h-10 w-10 mx-auto mb-4 text-teal-700"/>
              <h3 className="text-xl font-semibold mb-2">Local Discovery</h3>
              <p className="text-muted-foreground">Find verified healthcare providers in your city with location-based search.</p>
            </div>
            <div className="text-center p-6 rounded-xl border bg-card">
              <Calendar className="h-10 w-10 mx-auto mb-4 text-teal-700"/>
              <h3 className="text-xl font-semibold mb-2">Easy Appointments</h3>
              <p className="text-muted-foreground">Book appointments with doctors online. No waiting in queues.</p>
            </div>
            <div className="text-center p-6 rounded-xl border bg-card">
              <Shield className="h-10 w-10 mx-auto mb-4 text-teal-700"/>
              <h3 className="text-xl font-semibold mb-2">Verified Providers</h3>
              <p className="text-muted-foreground">All doctors, pharmacies and labs are verified before listing.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-stone-50 dark:bg-stone-900">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Are You a Healthcare Provider?</h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Join our platform to reach more patients. List your practice, manage appointments, and grow your presence.
          </p>
          <Link href="/register">
            <Button size="lg" className="bg-teal-700 hover:bg-teal-800">
              Join as Provider
            </Button>
          </Link>
        </div>
      </section>
    </div>);
}
