import { useState } from "react";
import { webuntisApi } from "@/lib/webuntis_api";
import { Klasse } from "webuntis";

export default function ClassesPage() {
  const [classes, setClasses] = useState<Klasse[] | null>(null);

  const fetchClasses = async () => {
    // Simulate fetching classes from an API
    try {
      const fetchedClasses = await webuntisApi.getClasses();
      setClasses(fetchedClasses);
    } catch (error) {
      console.error("Failed to fetch classes:", error);
    }
  };
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold mb-4">Classes Page</h1>
      <p className="text-gray-600">
        This is the classes page under the dashboard.
      </p>
    </div>
  );
}
