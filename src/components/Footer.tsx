import { Link } from "@tanstack/react-router";
import { Instagram, Facebook, Linkedin, Youtube, Mail, Phone, MapPin } from "lucide-react";
import logo from "@/assets/logo.png";
import { SITE } from "@/lib/site";

export function Footer() {
  return (
    <footer className="bg-secondary text-secondary-foreground mt-24">
      <div className="container-px mx-auto max-w-7xl py-16 grid gap-10 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2.5">
            <img src={logo} alt={SITE.name} className="h-12 w-12 object-contain bg-white rounded-full p-1" />
            <div className="leading-tight">
              <div className="text-primary font-extrabold">DANIYAL DESIGNER</div>
              <div className="font-bold text-[10px] tracking-wider uppercase opacity-80">MARKETING PLANNER</div>
            </div>
          </div>
          <p className="mt-4 text-sm text-secondary-foreground/70 max-w-xs">
            A boutique digital growth studio helping brands turn clicks into loyal customers.
          </p>
          <div className="mt-5 flex gap-3">
            {[
              { Icon: Instagram, href: SITE.social.instagram },
              { Icon: Facebook, href: SITE.social.facebook },
              { Icon: Linkedin, href: SITE.social.linkedin },
              { Icon: Youtube, href: SITE.social.youtube },
            ].map(({ Icon, href }, i) => (
              <a key={i} href={href} target="_blank" rel="noreferrer"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-primary flex items-center justify-center transition-colors">
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-4">Quick Links</h4>
          <ul className="space-y-2 text-sm text-secondary-foreground/70">
            {[
              ["Home","/"],["Services","/services"],["Tools","/tools"],["About","/about"],["Contact","/contact"],
            ].map(([l,h]) => (
              <li key={h}><Link to={h} className="hover:text-primary transition-colors">{l}</Link></li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-4">Services</h4>
          <ul className="space-y-2 text-sm text-secondary-foreground/70">
            <li>Digital Marketing</li>
            <li>Graphic Designing</li>
            <li>Video Editing</li>
            <li>Photography</li>
            <li>Tools Rental</li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-4">Get in Touch</h4>
          <ul className="space-y-3 text-sm text-secondary-foreground/70">
            <li className="flex items-start gap-2"><Mail className="w-4 h-4 mt-0.5 text-primary" />{SITE.email}</li>
            <li className="flex items-start gap-2"><Phone className="w-4 h-4 mt-0.5 text-primary" />{SITE.phone}</li>
            <li className="flex items-start gap-2"><MapPin className="w-4 h-4 mt-0.5 text-primary" />{SITE.location}</li>
          </ul>
          <div className="mt-5">
            <div className="text-xs uppercase tracking-wider text-secondary-foreground/50 mb-2">We Accept</div>
            <div className="flex flex-wrap gap-2 text-[11px] font-semibold">
              {["PayPal","Payoneer","Stripe","Wise","Crypto"].map((p) => (
                <span key={p} className="px-2.5 py-1 rounded-md bg-white/10">{p}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-px mx-auto max-w-7xl py-5 text-xs text-secondary-foreground/60 flex flex-col md:flex-row gap-2 justify-between">
          <p>© {new Date().getFullYear()} {SITE.name}. All rights reserved.</p>
          <p>Created By: <a href="https://daniyaldesigner.com/" target="_blank" rel="noreferrer" className="hover:text-primary transition-colors">Daniyal Designer</a></p>
        </div>
      </div>
    </footer>
  );
}
