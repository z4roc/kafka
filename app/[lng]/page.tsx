import LandingPage from "@/components/landing";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kafka - Home",
  description: "Welcome to the home page of Kafka",
};

export default function Home() {
  return <LandingPage />;
}
