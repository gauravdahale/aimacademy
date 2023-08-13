
import firebase from "firebase/compat";
import Timestamp = firebase.firestore.Timestamp;


export interface TestInfo {
    id:string,
    testName: string;
    date:Timestamp
    batchName: string;
    students: StudentInfo[];
    createdAt:Date
}

export interface StudentInfo {
    rollNo: string;
    name: string;
    totalMarks: string;
    correct: string;
    rank?:number;
}
