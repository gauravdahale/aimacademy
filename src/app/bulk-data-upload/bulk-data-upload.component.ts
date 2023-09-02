import { Component } from '@angular/core';
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {JsonDataService} from "./json-data.service";

@Component({
  selector: 'app-bulk-data-upload',
  templateUrl: './bulk-data-upload.component.html',
  styleUrls: ['./bulk-data-upload.component.scss']
})
export class BulkDataUploadComponent {
constructor(private readonly mFirestore:AngularFirestore,
            private  readonly jsonService:JsonDataService) {

}
    upload() {
        const filePath = 'assets/json/aimdata.json'; // Adjust the file path accordingly

        this.jsonService.getJsonData(filePath).subscribe(
            (jsonData) => {
                // Upload each document from the JSON data to Firestore
             alert(jsonData)
                for (const document of jsonData) {
                    console.log(document)
                    document.rollNo =document.rollNo.toString()
                    document.date = null; // Convert date string to Date object

                    // Upload the JSON data to Firestore using the FirestoreService
                    this.mFirestore.collection('students').doc(document.rollNo).set(document)
                        .then(() => {
                            console.log('Data uploaded successfully');
                        })
                        .catch((error) => {
                            console.error('Error uploading data:', error);
                        });
                }

            },
            (error) => {
                console.error('Error reading JSON data from assets:', error);
            }
        );
    }

}
