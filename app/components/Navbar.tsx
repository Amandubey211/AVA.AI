// components/Navbar.tsx
'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function Navbar() {
  return (
    <motion.nav 
      className="w-full py-4 px-8 flex justify-between items-center bg-black/50 backdrop-blur-sm fixed top-0 z-50"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 100 }}
    >
      <Link href="/">
        <div className="text-2xl font-bold">AVA.AI</div>
      </Link>
      <div className="hidden md:flex gap-8 items-center">
        <Link href="#" className="hover:text-green-400 transition-colors">AI Assistants</Link>
        <Link href="#" className="hover:text-green-400 transition-colors">Studio</Link>
        <Link href="#" className="hover:text-green-400 transition-colors">Plans & Pricing</Link>
      </div>
      <motion.button 
        className="px-5 py-2 bg-green-500 rounded-full font-semibold hover:bg-green-400 transition-colors"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Subscribe Now
      </motion.button>
    </motion.nav>
  );
}