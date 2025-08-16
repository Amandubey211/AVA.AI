// components/BuyMeACoffeeModal.tsx
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import Image from "next/image";
// Add your QR code image to /public/images/
import qrCodeImage from "@/public/Aman/buy-me-a-coffee-qr.png";

interface BuyMeACoffeeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function BuyMeACoffeeModal({
  isOpen,
  onClose,
}: BuyMeACoffeeModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 modal-backdrop-blur"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            className="relative w-full max-w-sm bg-gray-800 rounded-2xl p-8 text-center border border-white/10 shadow-2xl"
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 transition-colors"
              aria-label="Close modal"
            >
              <X size={20} />
            </button>
            <h3 className="text-2xl font-bold text-white mb-2">
              Support the Project
            </h3>
            <p className="text-gray-400 mb-6">
              Your support helps cover API costs and keeps development going.
              Thank you!
            </p>
            <div className="bg-white p-4 rounded-lg">
              <Image
                src={qrCodeImage}
                alt="Buy Me a Coffee QR Code"
                width={256}
                height={256}
                style={{ width: "100%", height: "auto" }}
              />
            </div>
            <a
              href="https://buymeacoffee.com/amandubey.dev" // Replace with your actual link
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-block w-full py-3 bg-yellow-500 text-black font-bold rounded-lg hover:bg-yellow-400 transition-colors"
            >
              or visit my Buy Me a Coffee page
            </a>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
