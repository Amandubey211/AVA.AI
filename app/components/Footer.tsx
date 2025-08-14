import Link from "next/link";
import Image from "next/image"; // Make sure this import is at the top

export default function Footer() {
  return (
    <footer className="bg-black text-gray-400 py-12 px-8 border-t border-gray-800">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Existing Section 1: Product Branding */}
        <div>
          <h3 className="text-xl font-bold text-white mb-4">AVA.AI</h3>
          <p>
            Next-generation AI assistants for immersive digital interactions.
          </p>
        </div>

        {/* Existing Section 2: Platform Links */}
        <div>
          <h4 className="font-semibold text-white mb-4">Platform</h4>
          <ul>
            <li className="mb-2">
              <Link href="#" className="hover:text-purple-400">
                Features
              </Link>
            </li>
            <li className="mb-2">
              <Link href="#" className="hover:text-purple-400">
                Pricing
              </Link>
            </li>
            <li className="mb-2">
              <Link href="#" className="hover:text-purple-400">
                Studio
              </Link>
            </li>
          </ul>
        </div>

        {/* Existing Section 3: Company Links */}
        <div>
          <h4 className="font-semibold text-white mb-4">Company</h4>
          <ul>
            <li className="mb-2">
              <Link href="#" className="hover:text-purple-400">
                About Us
              </Link>
            </li>
            <li className="mb-2">
              <Link href="#" className="hover:text-purple-400">
                Careers
              </Link>
            </li>
            <li className="mb-2">
              <Link href="#" className="hover:text-purple-400">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        {/* NEW Section 4: About the Creator / Owner */}
        <div>
          <h4 className="font-semibold text-white mb-4">Meet the Creator</h4>
          <div className="flex flex-col items-start">
            {/* Your actual photo using the updated Image component syntax */}
            <div className="relative w-24 h-24 rounded-full overflow-hidden mb-4 border border-gray-600">
              <Image
                src="/images/aman.dev.png" // Make sure this path is correct relative to your 'public' folder
                alt="Aman Dubey"
                width={96} // Explicitly define width
                height={96} // Explicitly define height
                className="rounded-full object-cover" // object-cover helps ensure it fills the space
              />
            </div>

            <p className="text-white font-semibold mb-2">Aman Dubey</p>
            <p className="text-sm mb-4">
              Product-minded Full-Stack Developer & Creator of AVA.AI
            </p>

            {/* Social Links */}
            <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
              <Link
                href="https://amandubey.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-purple-400"
              >
                Portfolio
              </Link>
              <Link
                href="https://github.com/Amandubey211"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-purple-400"
              >
                {" "}
                {/* IMPORTANT: Replace with your GitHub URL */}
                GitHub
              </Link>
              <Link
                href="https://www.linkedin.com/in/profile-amandubey/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-purple-400"
              >
                LinkedIn
              </Link>
              <a
                href="mailto:amandubey8833@gmail.com"
                className="hover:text-purple-400"
              >
                {" "}
                {/* Your primary contact email */}
                Email
              </a>
              {/* Optional: Add other links like Topmate, Twitter/X if you use them actively */}
            </div>
          </div>
        </div>
      </div>

      {/* Copyright Section */}
      <div className="max-w-7xl mx-auto mt-8 pt-8 border-t border-gray-800 text-center text-sm">
        <p>
          &copy; {new Date().getFullYear()} AVA.AI Platform Inc. All rights
          reserved.
        </p>
        <p className="mt-2 text-gray-500">Developed with ❤️ by Aman Dubey</p>
      </div>
    </footer>
  );
}
