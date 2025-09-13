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
  deleteDoc,
} from "firebase/firestore";
import subjectsData from "@/data/subjects.json";
import { webuntisApi } from "./webuntis_api";

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
export const getUserSubjects = async (
  userId: string
): Promise<UserSubject[]> => {
  // This would normally fetch from Firestore
  const userSubjectRef = collection(db, "users", userId, "subjects");
  const snapshot = await getDocs(userSubjectRef);
  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      ...data,
      enrolledAt: data.enrolledAt?.toDate
        ? data.enrolledAt.toDate()
        : new Date(data.enrolledAt),
    } as UserSubject;
  });
};

export const addUserSubject = async (
  subject: Subject,
  userId: string
): Promise<void> => {
  // This would normally save to Firestore
  const userSubjectRef = doc(
    collection(db, "users", userId, "subjects"),
    subject.id.toString()
  );
  const newUserSubject: UserSubject = {
    ...subject,
    enrolledAt: new Date(),
    completed: false,
  };
  await setDoc(userSubjectRef, {
    ...newUserSubject,
    enrolledAt: newUserSubject.enrolledAt, // Firestore will store as Timestamp
  });
};

export const removeUserSubject = async (
  subjectId: number,
  userId: string
): Promise<void> => {
  // This would normally remove from Firestore
  const userSubjectRef = doc(
    collection(db, "users", userId, "subjects"),
    subjectId.toString()
  );
  await deleteDoc(userSubjectRef);
};

export const updateSubjectGrade = async (
  subjectId: number,
  userId: string,
  grade: number
): Promise<void> => {
  // This would normally update in Firestore
  const userSubjectRef = doc(
    collection(db, "users", userId, "subjects"),
    subjectId.toString()
  );
  await updateDoc(userSubjectRef, {
    grade,
    completed: true,
  });
};
