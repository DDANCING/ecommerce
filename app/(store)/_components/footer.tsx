import { Input } from "@/components/ui/input";
import Link from "next/link"
import { FaFacebookSquare } from "react-icons/fa";
import { FaSquareInstagram } from "react-icons/fa6";
import { SiTiktok } from "react-icons/si";


export const Footer = () => {
    return (
        <footer className="w-full bg-zinc-900 text-white py-12 px-6">
  <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
    {/* Coluna 1 */}
    <div>
      <h3 className="text-xl font-semibold mb-2">ATer</h3>
      <p className="text-sm text-gray-400">
        Rotonda Giuliani 3 Bianco<br />
        Veneto, 62133 Bergamo (VS)<br />
        info@ater.com
      </p>
    </div>
    {/* Coluna 2 */}
    <div>
      <h4 className="text-lg font-semibold mb-2">Menu</h4>
      <ul className="space-y-1 text-gray-400 text-sm">
        <li><Link href="/">Home</Link></li>
        <li><Link href="#">About</Link></li>
        <li><Link href="#">Shop</Link></li>
        <li><Link href="#">FAQ</Link></li>
      </ul>
    </div>
    {/* Coluna 3 */}
    <div>
      <h4 className="text-lg font-semibold mb-2">Operational</h4>
      <p className="text-sm text-gray-400">
        Every day: 9:00 - 22:00<br />
        Sat - Sun: 8:00 - 21:00<br />
        <br />
        <strong>You need a consult?</strong><br />
        (+239) 1500-567-8990
      </p>
    </div>
    {/* Coluna 4 */}
    <div>
      <h4 className="text-lg font-semibold mb-2">Subscribe to our newsletter</h4>
      <div className="flex items-center gap-2">
        <Input
          type="email"
          placeholder="Email"
          className="px-4 py-2 rounded-full text-background w-full"
        />
        <button className="bg-foreground text-background px-4 py-2 rounded-full font-medium">
          Subscribe
        </button>
      </div>
    </div>
  </div>
  {/* Copyright */}
  <div className="border-t border-gray-700 pt-6 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
    <p>Copyright © 2025 M/M. All Rights Reserved.</p>
    <div className="flex gap-4 mt-4 md:mt-0">
      <Link href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
      <button><FaFacebookSquare /></button>
      </Link>
       <Link href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
      <button><FaSquareInstagram /></button>
      </Link>
        <Link href="https://www.tiktok.com/" target="_blank" rel="noopener noreferrer">
      <button><SiTiktok /> </button>
      </Link>
    </div>
  </div>
</footer>
    )
}