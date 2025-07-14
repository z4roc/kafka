"use client";

import type { UserSubject } from "@/types/subjects";
import { removeUserSubject } from "@/lib/subjects";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GradeEntry } from "@/components/grade-entry";
import { Trash2, Calendar, Award } from "lucide-react";

interface ClassesListProps {
  subjects: UserSubject[];
  onSubjectsChanged: () => void;
}

export function ClassesList({ subjects, onSubjectsChanged }: ClassesListProps) {
  const handleRemoveSubject = async (subjectId: number) => {
    if (confirm("Are you sure you want to remove this subject?")) {
      try {
        await removeUserSubject(subjectId);
        onSubjectsChanged();
      } catch (error) {
        console.error("Failed to remove subject:", error);
      }
    }
  };

  const getGradeColor = (grade: number) => {
    if (grade <= 1.5) return "text-green-600";
    if (grade <= 2.5) return "text-blue-600";
    if (grade <= 3.5) return "text-yellow-600";
    if (grade <= 4.0) return "text-orange-600";
    return "text-red-600";
  };

  const getGradeText = (grade: number) => {
    if (grade <= 1.5) return "Excellent";
    if (grade <= 2.5) return "Good";
    if (grade <= 3.5) return "Satisfactory";
    if (grade <= 4.0) return "Sufficient";
    return "Insufficient";
  };

  if (subjects.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
          <Award className="h-12 w-12 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-2">No subjects enrolled</h3>
        <p className="text-muted-foreground mb-4">
          Start building your curriculum by adding subjects from our extensive
          catalog.
        </p>
      </div>
    );
  }

  const completedSubjects = subjects.filter((s) => s.completed);
  const activeSubjects = subjects.filter((s) => !s.completed);
  const averageGrade =
    completedSubjects.length > 0
      ? completedSubjects.reduce((sum, s) => sum + (s.grade || 0), 0) /
        completedSubjects.length
      : 0;

  return (
    <div className="space-y-6">
      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">Total Subjects</p>
                <p className="text-2xl font-bold">{subjects.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold">{completedSubjects.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm text-muted-foreground">Average Grade</p>
                <p
                  className={`text-2xl font-bold ${
                    averageGrade > 0 ? getGradeColor(averageGrade) : ""
                  }`}
                >
                  {averageGrade > 0 ? averageGrade.toFixed(1) : "-"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Subjects */}
      {activeSubjects.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4">Active Subjects</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeSubjects.map((subject) => (
              <Card
                key={subject.id}
                className="hover:shadow-md transition-shadow"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <Badge
                      variant="secondary"
                      style={{
                        backgroundColor: subject.backColor || "#f1f5f9",
                        color: subject.foreColor || "#0f172a",
                      }}
                    >
                      {subject.name}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveSubject(subject.id)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <CardTitle className="text-base">
                    {subject.longName}
                  </CardTitle>
                  <CardDescription>
                    Enrolled: {subject.enrolledAt.toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <GradeEntry
                    subject={subject}
                    onGradeUpdated={onSubjectsChanged}
                  />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Completed Subjects */}
      {completedSubjects.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4">Completed Subjects</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {completedSubjects.map((subject) => (
              <Card
                key={subject.id}
                className="hover:shadow-md transition-shadow border-green-200"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <Badge
                      variant="secondary"
                      style={{
                        backgroundColor: subject.backColor || "#f1f5f9",
                        color: subject.foreColor || "#0f172a",
                      }}
                    >
                      {subject.name}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveSubject(subject.id)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <CardTitle className="text-base">
                    {subject.longName}
                  </CardTitle>
                  <CardDescription>
                    Enrolled: {subject.enrolledAt.toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p
                        className={`text-2xl font-bold ${getGradeColor(
                          subject.grade!
                        )}`}
                      >
                        {subject.grade?.toFixed(1)}
                      </p>
                      <p className={`text-sm ${getGradeColor(subject.grade!)}`}>
                        {getGradeText(subject.grade!)}
                      </p>
                    </div>
                    <Badge
                      variant="outline"
                      className="text-green-600 border-green-600"
                    >
                      Completed
                    </Badge>
                  </div>
                  <GradeEntry
                    subject={subject}
                    onGradeUpdated={onSubjectsChanged}
                  />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
