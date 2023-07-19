import {Component, Inject} from '@angular/core';
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {MatSnackBar} from "@angular/material/snack-bar";
import {DialogRef} from "@angular/cdk/dialog";
import {MAT_DIALOG_DATA} from "@angular/material/dialog";

@Component({
    selector: 'app-add-class',
    templateUrl: './add-class.component.html',
    styleUrls: ['./add-class.component.css']
})
export class AddClassComponent {
    className = ''

    constructor(
        private mFirestore: AngularFirestore,
        private matSnackBar: MatSnackBar,
        private matDialogRef: DialogRef<AddClassComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        if (this.data != null) this.className = this.data.className
    }

    addClass() {
        if (this.className != '' && this.data == null) {
            this.mFirestore.collection('class').add({className: this.className}).then(() => {
                this.matSnackBar.open('Class added successfully')._dismissAfter(2000)
                this.matDialogRef.close()
            })

        }
        if (this.className != '' && this.data != null) {
            this.mFirestore.collection('class').doc(this.data.id).update({className: this.className}).then(() => {
                this.matSnackBar.open('Class added successfully')._dismissAfter(2000)
                this.matDialogRef.close()
            })

        }

        else {
            this.matSnackBar.open('Please enter class name')._dismissAfter(3000)
        }
    }

}
