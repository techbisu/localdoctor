"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, MapPin, Loader2 } from "lucide-react";

export function SearchBox() {
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");
  const [loadingLocation, setLoadingLocation] = useState(false);
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query) params.set("query", query);
    if (location) params.set("city", location);
    router.push(`/search?${params.toString()}`);
  };

  const handleUseLocation = () => {
    setLoadingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const params = new URLSearchParams();
        params.set("lat", String(latitude));
        params.set("lng", String(longitude));
        if (query) params.set("query", query);
        router.push(`/search?${params.toString()}`);
        setLoadingLocation(false);
      },
      () => {
        setLoadingLocation(false);
        alert("Location access denied. Please enter a city manually.");
      }
    );
  };

  return (
    <form onSubmit={handleSearch} className="space-y-3">
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Doctor, specialist, problem, pharmacy, or lab test..."
            className="pl-10 h-12"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className="relative flex-1">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="City or area"
            className="pl-10 h-12"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>
        <Button type="submit" className="h-12 px-8 bg-teal-700 hover:bg-teal-800">
          Search
        </Button>
      </div>
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleUseLocation}
          disabled={loadingLocation}
          className="text-teal-700"
        >
          {loadingLocation ? (
            <Loader2 className="mr-1 h-3 w-3 animate-spin" />
          ) : (
            <MapPin className="mr-1 h-3 w-3" />
          )}
          {loadingLocation ? "Detecting..." : "Use my location"}
        </Button>
      </div>
    </form>
  );
}
