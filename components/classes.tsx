"use client";

import { useState, useEffect } from "react";
import type { UserSubject } from "@/types/subjects";
import { getUserSubjects } from "@/lib/subjects";
import { ClassesList } from "@/components/classes-list";
import { SubjectSelector } from "@/components/subject-selector";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BookOpen } from "lucide-react";
import { useAuthStore } from "@/hooks/auth_hook";

export default function Classes() {
  const [subjects, setSubjects] = useState<UserSubject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuthStore();

  const loadSubjects = async () => {
    if (!user?.uid) return; // Wait until user.uid is defined
    try {
      const userSubjects = await getUserSubjects(user.uid);
      setSubjects(userSubjects);
    } catch (error) {
      console.error("Failed to load subjects:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user?.uid) {
      loadSubjects();
    }
  }, [user?.uid]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your classes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <BookOpen className="h-8 w-8" />
            My Classes
          </h1>
          <p className="text-muted-foreground">
            Manage your enrolled subjects and track your academic progress
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <ClassesList subjects={subjects} onSubjectsChanged={loadSubjects} />
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Add New Subject</CardTitle>
              <CardDescription>
                Browse and add subjects from our catalog
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SubjectSelector
                onSubjectAdded={loadSubjects}
                enrolledSubjectIds={subjects.map((s) => s.id)}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  Total Subjects:
                </span>
                <span className="font-medium">{subjects.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  Completed:
                </span>
                <span className="font-medium">
                  {subjects.filter((s) => s.completed).length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  In Progress:
                </span>
                <span className="font-medium">
                  {subjects.filter((s) => !s.completed).length}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
