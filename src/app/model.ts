
import firebase from "firebase/compat";
import Timestamp = firebase.firestore.Timestamp;


export interface TestInfo {
    id:string,
    testName: string;
    date:Timestamp
    batchName: string;
    students: StudentInfo[];
    totalMarks:string

    createdAt:Date
}

export interface StudentInfo {
    rollNo: string;
    name: string;
    totalMarks: string;
    correct: string;
    rightAnswers:string
    wrongAnswers:string
    rank?:number;
}
export  interface  StudentAttendance{
    className:string,
    date:string,
    rollNo:string,
    status:string,
    studentName:string
}
