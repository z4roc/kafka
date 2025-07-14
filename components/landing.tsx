"use client";
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
  Github,
  Star,
  Heart,
} from "lucide-react";
import Link from "next/link";
import { useAuthStore } from "@/hooks/auth_hook";
import Image from "next/image";

export default function LandingPage() {
  const { user } = useAuthStore();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50 dark:bg-gray-900/80 dark:border-gray-800">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Image src="/logo.png" alt="Logo" width={40} height={40} />
            <span className="text-4xl font-bold pl-4 text-gray-900 dark:text-white">
              Kafka
            </span>
          </div>
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="https://github.com/z4roc/yourical_enchanced">
              <Button variant={"ghost"}>
                <Github className="h-5 w-5" />
                Source
              </Button>
            </Link>
            <Link
              href="#about"
              className="text-gray-600 dark:text-gray-300 hover:text-blue-600 transition-colors"
            >
              Über uns
            </Link>

            <Link
              href="#"
              className="text-gray-600 dark:text-gray-300 hover:text-blue-600 transition-colors"
            >
              <Button variant={"ghost"}>
                <Heart className="h-5 w-5" />
                Supporte uns!
              </Button>
            </Link>
          </nav>
          <div className="flex items-center space-x-4">
            {user ? (
              <Button>
                <Link href="/dashboard">Mein Dashboard</Link>
              </Button>
            ) : (
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  className="hidden sm:inline-flex"
                  asChild
                >
                  <Link href="/login">Login</Link>
                </Button>
                <Button className="bg-blue-600 hover:bg-blue-700" asChild>
                  <Link href="/register" className="dark:text-white">
                    Jetzt Loslegen
                  </Link>
                </Button>
              </div>
            )}
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
                  Plane dein <em>perfektes</em>{" "}
                  <span className="text-blue-600">Semester</span>
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
                  Wähle deine Kurse, plane dein Semester und organisiere deine
                  Notizen und synchronisiere deinen Kalender – alles an einem
                  Ort.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-3"
                >
                  Jetzt starten
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="text-lg px-8 py-3 bg-transparent"
                >
                  <Github className="h-5 w-5 mr-2" />
                  <Link href="https://github.com/z4roc/yourical_enchanced">
                    Zum Projekt
                  </Link>
                </Button>
              </div>
              <div className="flex items-center space-x-8 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center space-x-2">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span>4.9/5 rating</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4" />
                  <span>Quelle Bruder vertrau mir</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="relative z-10 bg-white rounded-2xl shadow-2xl p-8 border dark:bg-gray-800 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold dark:text-white">
                    Winter 2025
                  </h3>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    15 ETCS
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <div className="flex-1">
                      <div className="font-medium dark:text-white">
                        Mathematik 2
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        HowW 8:00-9:30
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-green-50 dark:bg-green-900/30 rounded-lg">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <div className="flex-1">
                      <div className="font-medium dark:text-white">
                        Softwaretechnik
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        MatU 15:30-17:00
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-purple-50 dark:bg-purple-900/30 rounded-lg">
                    <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                    <div className="flex-1">
                      <div className="font-medium dark:text-white">
                        Einführung Informatik
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        JunB 14:00-15:30
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
              Alles was du für dein Studium brauchst
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Von der Kursplanung bis zur Notizverwaltung – wir haben alles
              integriert, um dir das Leben zu erleichtern.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Calendar className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle>Schlaue Semesterplanung</CardTitle>
                <CardDescription>
                  Plane deine Kurse und Aktivitäten mit unserem intelligenten
                  Semesterplaner.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                  <li>• Visuelle Fachauswahl</li>
                  <li>• Konflikte auflösen</li>
                  <li>• ETCS tracken</li>
                  <li>• Vorgaben einsehen</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <NotebookPen className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle>Integrierte Notizen</CardTitle>
                <CardDescription>
                  Halte deine Gedanken und Ideen direkt in deinem Kalender fest.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                  <li>• Direkt per Texteditor eintragen</li>
                  <li>• Fachspezifische Notizen</li>
                  <li>• Einfach durchsuchen</li>
                  <li>• Als PDF exportieren</li>
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
                  Immer auf dem neuesten Stand mit deinen Aufgaben und Terminen.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                  <li>• Abgaben reminder</li>
                  <li>• Prüfungsplanung</li>
                  <li>• Vorlesungstermine einhalten</li>
                  <li>• Fortschritt tracken</li>
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
              Starte jetzt mit der besten Studienplanung
            </h2>
            <p className="text-xl text-blue-100">
              Egal ob du gerade erst anfängst oder schon mitten im Studium
              steckst – wir haben die Tools, die du brauchst, um erfolgreich zu
              sein.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-3"
              >
                <Link href="/register">Jetzt registrieren</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-blue-600 text-lg px-8 py-3 bg-transparent"
              >
                <Github className="h-5 w-5 mr-2" />
                <Link href="https://github.com/z4roc/yourical_enchanced">
                  Zum Projekt
                </Link>
              </Button>
            </div>
            <p className="text-sm text-blue-200">
              Kostet nichts, einfach ausprobieren!
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
                <Image src="/logo.png" alt="Logo" width={40} height={40} />
                <span className="text-xl font-bold">Kafka</span>
              </div>
              <p className="text-gray-400">
                Studenten die ihr leben einfacher machen wollten, und das
                Ergebnis mit dir teilen.
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
                    Roadmap
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
                  <Link
                    href="https://github.com/z4roc"
                    className="hover:text-white transition-colors"
                  >
                    ZAROC
                  </Link>
                </li>
                <li>
                  <Link
                    href="https://github.com/piesalad"
                    className="hover:text-white transition-colors"
                  >
                    Tfinn
                  </Link>
                </li>
                <li>
                  <Link
                    href="https://github.com/Tyrenjo"
                    className="hover:text-white transition-colors"
                  >
                    Tyrenjo
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 ZAROC. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
