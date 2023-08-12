export interface TestInfo {
    testName: string;
    date: string; // You might want to use a Date type here
    batchName: string;
    students: StudentInfo[];
}

export interface StudentInfo {
    rollNo: string;
    name: string;
    totalMarks: string;
    correct: string;
}
