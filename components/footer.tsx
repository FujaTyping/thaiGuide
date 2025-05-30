import Link from "next/link"
import { Facebook, Instagram, Twitter } from "lucide-react"
import Logo from "@/assets/favicon.png"

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">

          <div className="col-span-1">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <img src={Logo.src} alt="Logo" className="h-10" />
              <span className="font-bold text-xl font-['Poppins']">PhuGuide</span>
            </Link>
            <p className="text-gray-400 mb-4">
              Discover Phuket through gamified adventures and amazing experiences.
            </p>
            <div className="flex space-x-4">
              <Link href="#" aria-label="Facebook"><Facebook className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer" /></Link>
              <Link href="#" aria-label="Instagram"><Instagram className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer" /></Link>
              <Link href="#" aria-label="Twitter"><Twitter className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer" /></Link>
            </div>
          </div>


          <div>
            <h3 className="font-semibold text-lg mb-4">Explore</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="/explore" className="hover:text-white">
                  Attractions
                </Link>
              </li>
              <li>
                <Link href="/missions" className="hover:text-white">
                  Missions
                </Link>
              </li>
              <li>
                <Link href="/trip-planner" className="hover:text-white">
                  Trip Planner
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white">
                  About Phuket
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Community</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="/leaderboard" className="hover:text-white">
                  Leaderboard
                </Link>
              </li>
              <li>
                <Link href="/rewards" className="hover:text-white">
                  รางวัล
                </Link>
              </li>
              <li>
                <Link href="/minigames" className="hover:text-white">
                  Minigames
                </Link>
              </li>
              <li>
                <Link href="/profile" className="hover:text-white">
                  Profile
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Support</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="#" className="hover:text-white">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 Phuket Travel Advisor. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
