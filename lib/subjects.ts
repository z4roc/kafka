import type { Subject, UserSubject } from "@/types/subjects";
import { db } from "@/lib/firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  writeBatch,
} from "firebase/firestore";
import subjectsData from "@/data/subjects.json";
import { webuntisApi } from "./webuntis_api";
import { write } from "fs";

export const getAllSubjects = (): Subject[] => {
  return subjectsData.filter((subject) => subject.active);
};

export const setAllSubjects = async (): Promise<void> => {
  const subjects = await webuntisApi.getSubjects();
  const batch = writeBatch(db);
  subjects.forEach((subject) => {
    const subjectRef = doc(collection(db, "subjects"), subject.id.toString());
    batch.set(subjectRef, subject);
  });
  await batch.commit();
};

export const getSubjectById = (id: number): Subject | undefined => {
  return subjectsData.find((subject) => subject.id === id);
};

export const searchSubjects = (query: string): Subject[] => {
  const lowercaseQuery = query.toLowerCase();
  return getAllSubjects().filter(
    (subject) =>
      subject.name.toLowerCase().includes(lowercaseQuery) ||
      subject.longName.toLowerCase().includes(lowercaseQuery) ||
      subject.alternateName.toLowerCase().includes(lowercaseQuery)
  );
};

// Mock functions for Firebase integration (to be replaced with actual Firebase calls)
export const getUserSubjects = async (): Promise<UserSubject[]> => {
  // This would normally fetch from Firestore
  const stored = localStorage.getItem("userSubjects");
  if (stored) {
    const subjects = JSON.parse(stored);
    return subjects.map((s: any) => ({
      ...s,
      enrolledAt: new Date(s.enrolledAt),
    }));
  }
  return [];
};

export const addUserSubject = async (subject: Subject): Promise<void> => {
  // This would normally save to Firestore
  const userSubjects = await getUserSubjects();
  const newUserSubject: UserSubject = {
    ...subject,
    enrolledAt: new Date(),
    completed: false,
  };

  const updated = [...userSubjects, newUserSubject];
  localStorage.setItem("userSubjects", JSON.stringify(updated));
};

export const removeUserSubject = async (subjectId: number): Promise<void> => {
  // This would normally remove from Firestore
  const userSubjects = await getUserSubjects();
  const updated = userSubjects.filter((s) => s.id !== subjectId);
  localStorage.setItem("userSubjects", JSON.stringify(updated));
};

export const updateSubjectGrade = async (
  subjectId: number,
  grade: number
): Promise<void> => {
  // This would normally update in Firestore
  const userSubjects = await getUserSubjects();
  const updated = userSubjects.map((s) =>
    s.id === subjectId ? { ...s, grade, completed: true } : s
  );
  localStorage.setItem("userSubjects", JSON.stringify(updated));
};
