import { ExternalLink, MapPin, Navigation } from "lucide-react";
import { cn } from "@/lib/utils";

const MAPS_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

/**
 * Google map of a venue using the Maps Embed API: free, no SDK to load, works on phones.
 * Without NEXT_PUBLIC_GOOGLE_MAPS_API_KEY it falls back to plain "Open in Google Maps" links.
 */
export function VenueMap({ address, className }: { address: string; className?: string }) {
  if (!address.trim()) return null;
  const q = encodeURIComponent(address);
  const openUrl = `https://www.google.com/maps/search/?api=1&query=${q}`;
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${q}`;

  return (
    <div className={cn("flex flex-col gap-2.5", className)}>
      {MAPS_KEY ? (
        <iframe
          title={`Map of ${address}`}
          src={`https://www.google.com/maps/embed/v1/place?key=${MAPS_KEY}&q=${q}`}
          className="h-48 w-full rounded-xl border border-line"
          loading="lazy"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
        />
      ) : (
        <a
          href={openUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-32 flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-[#C9CDD6] bg-line-soft text-sm font-semibold text-muted hover:text-ink"
        >
          <MapPin className="size-5" aria-hidden />
          View on Google Maps
        </a>
      )}
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm font-bold">
        <a href={directionsUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-brand-600 hover:text-brand-700">
          <Navigation className="size-4" aria-hidden /> Get directions
        </a>
        <a href={openUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-brand-600 hover:text-brand-700">
          <ExternalLink className="size-4" aria-hidden /> Open in Google Maps
        </a>
      </div>
    </div>
  );
}

/** "Landmark Centre, Hall B, Plot 2 Water Corporation Dr, Victoria Island" */
export const venueAddress = (location: { venue?: string; address?: string; city?: string }) =>
  [location.venue, location.address, location.city].filter(Boolean).join(", ");
