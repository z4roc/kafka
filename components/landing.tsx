import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Calendar,
  NotebookPen,
  Users,
  Clock,
  BookOpen,
  Star,
} from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50 dark:bg-gray-900/80 dark:border-gray-800">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <BookOpen className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              StudyPlan
            </span>
          </div>
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="#features"
              className="text-gray-600 dark:text-gray-300 hover:text-blue-600 transition-colors"
            >
              Features
            </Link>
            <Link
              href="#about"
              className="text-gray-600 dark:text-gray-300 hover:text-blue-600 transition-colors"
            >
              About
            </Link>
            <Link
              href="#contact"
              className="text-gray-600 dark:text-gray-300 hover:text-blue-600 transition-colors"
            >
              Contact
            </Link>
          </nav>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" className="hidden sm:inline-flex">
              Sign In
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700">
              Get Started
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="inline-block rounded-full bg-blue-100 dark:bg-blue-900/50 px-4 py-2 text-sm font-medium text-blue-800 dark:text-blue-200">
                  🎓 For Students, By Students
                </div>
                <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight">
                  Plan Your Perfect{" "}
                  <span className="text-blue-600">Semester</span>
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
                  Organize your classes, take notes, and stay on top of your
                  academic journey. The all-in-one platform designed to help
                  students succeed.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-3"
                >
                  Start Planning Now
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="text-lg px-8 py-3 bg-transparent"
                >
                  Watch Demo
                </Button>
              </div>
              <div className="flex items-center space-x-8 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center space-x-2">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span>4.9/5 rating</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4" />
                  <span>10k+ students</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="relative z-10 bg-white rounded-2xl shadow-2xl p-8 border dark:bg-gray-800 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold dark:text-white">
                    Fall 2024 Schedule
                  </h3>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    15 credits
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <div className="flex-1">
                      <div className="font-medium dark:text-white">
                        Computer Science 101
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        MWF 9:00-10:00 AM
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-green-50 dark:bg-green-900/30 rounded-lg">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <div className="flex-1">
                      <div className="font-medium dark:text-white">
                        Calculus II
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        TTh 11:00-12:30 PM
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-purple-50 dark:bg-purple-900/30 rounded-lg">
                    <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                    <div className="flex-1">
                      <div className="font-medium dark:text-white">
                        English Literature
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        MW 2:00-3:30 PM
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 w-72 h-72 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full opacity-20 blur-3xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">
              Everything You Need to Succeed
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              From planning your semester to taking comprehensive notes, we've
              got you covered.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Calendar className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle>Smart Semester Planning</CardTitle>
                <CardDescription>
                  Easily select and organize your classes with our intuitive
                  scheduling system.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                  <li>• Visual class scheduler</li>
                  <li>• Conflict detection</li>
                  <li>• Credit hour tracking</li>
                  <li>• Prerequisites checker</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <NotebookPen className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle>Integrated Note-Taking</CardTitle>
                <CardDescription>
                  Take and organize notes for each class in one centralized
                  location.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                  <li>• Rich text editor</li>
                  <li>• Class-specific notebooks</li>
                  <li>• Search functionality</li>
                  <li>• Export options</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <Clock className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle>Time Management</CardTitle>
                <CardDescription>
                  Stay on track with built-in reminders and deadline tracking.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                  <li>• Assignment reminders</li>
                  <li>• Exam scheduling</li>
                  <li>• Study time blocks</li>
                  <li>• Progress tracking</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-700 dark:to-purple-700">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-3xl lg:text-4xl font-bold text-white">
              Ready to Transform Your Academic Experience?
            </h2>
            <p className="text-xl text-blue-100">
              Join thousands of students who are already planning smarter and
              studying better.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-3"
              >
                Get Started Free
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-blue-600 text-lg px-8 py-3 bg-transparent"
              >
                Schedule Demo
              </Button>
            </div>
            <p className="text-sm text-blue-200">
              No credit card required • Free forever plan available
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 dark:bg-black">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <BookOpen className="h-6 w-6 text-blue-400" />
                <span className="text-xl font-bold">StudyPlan</span>
              </div>
              <p className="text-gray-400">
                Empowering students to achieve academic success through better
                planning and organization.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Updates
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Community
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Careers
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 StudyPlan. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
