import Link from 'next/link'

import { Facebook, Github, Instagram, Twitter } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="mx-auto max-w-7xl px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="text-2xl font-bold text-white">
              BRAND<span className="text-blue-500">.</span>
            </Link>
            <p className="mt-4 text-sm leading-6">
              Making the world a better place through constructing elegant
              hierarchies.
            </p>
            <div className="mt-6 flex space-x-5">
              <Link href="#" className="transition-colors hover:text-white">
                <Facebook size={20} />
              </Link>
              <Link href="#" className="transition-colors hover:text-white">
                <Instagram size={20} />
              </Link>
              <Link href="#" className="transition-colors hover:text-white">
                <Twitter size={20} />
              </Link>
              <Link href="#" className="transition-colors hover:text-white">
                <Github size={20} />
              </Link>
            </div>
          </div>

          {/* Links Sections */}
          <div>
            <h3 className="mb-4 font-semibold text-white">Solutions</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#" className="hover:text-white">
                  Marketing
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white">
                  Analytics
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white">
                  Commerce
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-semibold text-white">Support</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#" className="hover:text-white">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white">
                  Documentation
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white">
                  Guides
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-semibold text-white">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#" className="hover:text-white">
                  Claim
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white">
                  Privacy
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white">
                  Terms
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 border-t border-gray-800 pt-8 text-center md:flex md:justify-between md:text-left">
          <p className="text-xs">&copy; 2026 Brand Inc. All rights reserved.</p>
          <p className="mt-4 text-xs md:mt-0">Designed with ❤️ in Next.js</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
