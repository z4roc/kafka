"use client";

import type React from "react";

import { useState } from "react";
import type { UserSubject } from "@/types/subjects";
import { updateSubjectGrade } from "@/lib/subjects";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { GraduationCap, Edit } from "lucide-react";

interface GradeEntryProps {
  subject: UserSubject;
  onGradeUpdated: () => void;
}

export function GradeEntry({ subject, onGradeUpdated }: GradeEntryProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [grade, setGrade] = useState(subject.grade?.toString() || "");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const gradeValue = Number.parseFloat(grade);

    if (isNaN(gradeValue) || gradeValue < 1 || gradeValue > 6) {
      alert("Please enter a valid grade between 1.0 and 6.0");
      return;
    }

    setIsLoading(true);
    try {
      await updateSubjectGrade(subject.id, gradeValue);
      onGradeUpdated();
      setIsOpen(false);
    } catch (error) {
      console.error("Failed to update grade:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          {subject.completed ? (
            <>
              <Edit className="mr-2 h-4 w-4" />
              Edit Grade
            </>
          ) : (
            <>
              <GraduationCap className="mr-2 h-4 w-4" />
              Enter Grade
            </>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {subject.completed ? "Edit Grade" : "Enter Grade"}
          </DialogTitle>
          <DialogDescription>
            Enter the grade for {subject.longName}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="grade">Grade (1.0 - 6.0)</Label>
            <Input
              id="grade"
              type="number"
              min="1.0"
              max="6.0"
              step="0.1"
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              placeholder="e.g., 1.7"
              required
            />
            <p className="text-sm text-muted-foreground">
              German grading scale: 1.0 (excellent) to 6.0 (insufficient)
            </p>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Grade"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
