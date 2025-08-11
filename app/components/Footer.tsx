// components/Footer.tsx
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-black text-gray-400 py-12 px-8 border-t border-gray-800">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h3 className="text-xl font-bold text-white mb-4">AVATAR</h3>
          <p>Next-generation AI assistants.</p>
        </div>
        <div>
          <h4 className="font-semibold text-white mb-4">Platform</h4>
          <ul>
            <li className="mb-2">
              <Link href="#" className="hover:text-green-400">
                Features
              </Link>
            </li>
            <li className="mb-2">
              <Link href="#" className="hover:text-green-400">
                Pricing
              </Link>
            </li>
            <li className="mb-2">
              <Link href="#" className="hover:text-green-400">
                Studio
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-white mb-4">Company</h4>
          <ul>
            <li className="mb-2">
              <Link href="#" className="hover:text-green-400">
                About Us
              </Link>
            </li>
            <li className="mb-2">
              <Link href="#" className="hover:text-green-400">
                Careers
              </Link>
            </li>
            <li className="mb-2">
              <Link href="#" className="hover:text-green-400">
                Contact
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-white mb-4">Connect</h4>
          <p>socials@avatar.com</p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-8 pt-8 border-t border-gray-800 text-center text-sm">
        <p>
          &copy; {new Date().getFullYear()} Avatar Platform Inc. All rights
          reserved.
        </p>
      </div>
    </footer>
  );
}
