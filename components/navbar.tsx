import { BookOpen } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";

export function Navbar() {
  return (
    <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <BookOpen className="h-8 w-8 text-blue-600" />
          <span className="text-2xl font-bold text-gray-900">StudyPlan</span>
        </div>
        <nav className="hidden md:flex items-center space-x-8">
          <Link
            href="#features"
            className="text-gray-600 hover:text-blue-600 transition-colors"
          >
            Features
          </Link>
          <Link
            href="#about"
            className="text-gray-600 hover:text-blue-600 transition-colors"
          >
            About
          </Link>
          <Link
            href="#contact"
            className="text-gray-600 hover:text-blue-600 transition-colors"
          >
            Contact
          </Link>
        </nav>
        <div className="flex items-center space-x-4">
          <Button variant="ghost" className="hidden sm:inline-flex">
            Sign In
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700">Get Started</Button>
        </div>
      </div>
    </header>
  );
}
