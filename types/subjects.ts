export interface Subject {
  id: number;
  name: string;
  longName: string;
  alternateName: string;
  active: boolean;
  foreColor?: string;
  backColor?: string;
}

export interface UserSubject extends Subject {
  enrolledAt: Date;
  grade?: number;
  completed: boolean;
  credits?: number;
}

export interface GradeEntry {
  subjectId: number;
  grade: number;
  completedAt: Date;
  notes?: string;
}
