export type ClassroomData = {
  name: string;
  teacherId: string;
  startTime: string;
  endTime: string;
  days: string[];
};

export type Teacher = {
  _id: string;
  name: string;
  email: string;
};

export type Student = {
  _id: string;
  name: string;
  email: string;
};


export type  Classroom = {
  _id: string;
  name: string;
  teacher: Teacher;
  students: Student[];
  startTime: string;
  endTime: string;
  days: string[];
}
