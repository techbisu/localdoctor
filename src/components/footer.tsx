import Link from "next/link";
export function Footer() {
    return (<footer className="border-t bg-stone-50">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-lg text-teal-700 mb-4 flex items-center gap-2">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
              </svg>
              HealthFind
            </h3>
            <p className="text-sm text-muted-foreground">
              Helping citizens find quality healthcare near them. Trusted by thousands of patients and providers.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Discover</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/search?type=doctor" className="text-muted-foreground hover:text-teal-700 transition-colors">Find Doctors</Link></li>
              <li><Link href="/search?type=pharmacy" className="text-muted-foreground hover:text-teal-700 transition-colors">Find Pharmacies</Link></li>
              <li><Link href="/search?type=lab" className="text-muted-foreground hover:text-teal-700 transition-colors">Find Labs</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">For Providers</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/register" className="text-muted-foreground hover:text-teal-700 transition-colors">Join as Doctor</Link></li>
              <li><Link href="/register" className="text-muted-foreground hover:text-teal-700 transition-colors">Join as Pharmacy</Link></li>
              <li><Link href="/register" className="text-muted-foreground hover:text-teal-700 transition-colors">Join as Lab</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/privacy" className="text-muted-foreground hover:text-teal-700 transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-muted-foreground hover:text-teal-700 transition-colors">Terms of Service</Link></li>
              <li><Link href="/disclaimer" className="text-muted-foreground hover:text-teal-700 transition-colors">Medical Disclaimer</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground space-y-2">
          <p className="font-medium text-amber-700 bg-amber-50 rounded-lg py-2 px-4 inline-block">
            Medical emergency? Please contact your local emergency service or visit the nearest emergency facility.
          </p>
          <p> HealthFind. This platform is for healthcare discovery only and does not provide medical diagnosis.</p>
        </div>
      </div>
    </footer>);
}
