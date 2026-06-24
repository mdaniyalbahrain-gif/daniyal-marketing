import { MessageCircle } from "lucide-react";
import { motion } from "framer-motion";
import { waLink } from "@/lib/site";

export function WhatsAppFloat() {
  return (
    <motion.a
      href={waLink("Hi Daniyal, I found you via your website.")}
      target="_blank"
      rel="noreferrer"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1, type: "spring" }}
      whileHover={{ scale: 1.1 }}
      className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-[#25D366] text-white shadow-elegant flex items-center justify-center"
      aria-label="Chat on WhatsApp"
    >
      <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-30" />
      <MessageCircle className="w-7 h-7 relative" />
    </motion.a>
  );
}
