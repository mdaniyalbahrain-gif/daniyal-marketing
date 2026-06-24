import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

export const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

export function Reveal({ children, className, delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      variants={{
        hidden: { opacity: 0, y: 30 },
        show: { opacity: 1, y: 0, transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function SectionHeading({ eyebrow, title, subtitle, center = true }: { eyebrow?: string; title: ReactNode; subtitle?: ReactNode; center?: boolean }) {
  return (
    <Reveal className={center ? "text-center mx-auto max-w-2xl" : "max-w-2xl"}>
      {eyebrow && (
        <div className={`inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-primary mb-3 ${center ? "" : ""}`}>
          <span className="w-6 h-px bg-primary" /> {eyebrow}
        </div>
      )}
      <h2 className="text-3xl md:text-5xl font-extrabold leading-[1.1]">{title}</h2>
      {subtitle && <p className="mt-4 text-muted-foreground text-base md:text-lg">{subtitle}</p>}
    </Reveal>
  );
}
