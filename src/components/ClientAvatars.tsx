import { Star } from "lucide-react";
import c1 from "@/assets/avatars/c1.jpg";
import c2 from "@/assets/avatars/c2.jpg";
import c3 from "@/assets/avatars/c3.jpg";
import c4 from "@/assets/avatars/c4.jpg";
import c5 from "@/assets/avatars/c5.jpg";
import c6 from "@/assets/avatars/c6.jpg";

const AVATARS = [c1, c2, c3, c4, c5, c6];

export function ClientAvatars() {
  return (
    <div className="flex items-center gap-4">
      <div className="flex -space-x-3">
        {AVATARS.map((src, i) => (
          <img
            key={i}
            src={src}
            alt={`Happy client ${i + 1}`}
            loading="lazy"
            width={40}
            height={40}
            className="w-10 h-10 rounded-full border-2 border-background object-cover shadow-sm"
          />
        ))}
      </div>
      <div className="text-sm">
        <div className="flex gap-0.5 text-accent">
          {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
        </div>
        <div className="text-muted-foreground font-medium">200+ Happy Global Clients</div>
      </div>
    </div>
  );
}
