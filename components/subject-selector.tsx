"use client";

import { useState, useEffect } from "react";
import type { Subject } from "@/types/subjects";
import { getAllSubjects, searchSubjects, addUserSubject } from "@/lib/subjects";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAuthStore } from "@/hooks/auth_hook";

interface SubjectSelectorProps {
  onSubjectAdded: () => void;
  enrolledSubjectIds: number[];
}

export function SubjectSelector({
  onSubjectAdded,
  enrolledSubjectIds,
}: SubjectSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [filteredSubjects, setFilteredSubjects] = useState<Subject[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const { user } = useAuthStore();

  useEffect(() => {
    const allSubjects = getAllSubjects();
    setSubjects(allSubjects);
    setFilteredSubjects(allSubjects.slice(0, 50)); // Show first 50 initially
  }, []);

  useEffect(() => {
    if (searchQuery.trim()) {
      const results = searchSubjects(searchQuery);
      setFilteredSubjects(results.slice(0, 100)); // Limit results
    } else {
      setFilteredSubjects(subjects.slice(0, 50));
    }
  }, [searchQuery, subjects]);

  const handleAddSubject = async (subject: Subject) => {
    setIsLoading(true);
    try {
      await addUserSubject(subject, user!.uid);
      onSubjectAdded();
      setIsOpen(false);
      setSearchQuery("");
    } catch (error) {
      console.error("Failed to add subject:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const availableSubjects = filteredSubjects.filter(
    (subject) => !enrolledSubjectIds.includes(subject.id)
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="w-full">
          <Plus className="mr-2 h-4 w-4" />
          Add Subject
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Add Subject</DialogTitle>
          <DialogDescription>
            Search and select subjects to add to your curriculum
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search subjects by name or code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="overflow-y-auto max-h-[50vh] space-y-2">
            {availableSubjects.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                {searchQuery
                  ? "No subjects found matching your search."
                  : "No available subjects."}
              </div>
            ) : (
              availableSubjects.map((subject) => (
                <Card
                  key={subject.id}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge
                            variant="secondary"
                            style={{
                              backgroundColor: subject.backColor || "#f1f5f9",
                              color: subject.foreColor || "#0f172a",
                            }}
                          >
                            {subject.name}
                          </Badge>
                        </div>
                        <h4 className="font-medium">{subject.longName}</h4>
                        {subject.alternateName && (
                          <p className="text-sm text-muted-foreground">
                            {subject.alternateName}
                          </p>
                        )}
                      </div>
                      <Button
                        onClick={() => handleAddSubject(subject)}
                        disabled={isLoading}
                        size="sm"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
