import {Component, Inject} from '@angular/core';
import {Observable} from "rxjs";
import {StudentService} from "../../services/student.service";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Message} from "../../interfaces/message";
import {MessagesComponent} from "../messages.component";
import {MessageService} from "../../services/message.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";


@Component({
    selector: 'app-add-message',
    templateUrl: './add-message.component.html',
    styleUrls: ['./add-message.component.scss']
})
export class AddMessageComponent {
    form: FormGroup<any>
    batchNames$: Observable<any>

    constructor(private readonly mStudentService: StudentService,
                private readonly mMessagesService: MessageService,
                private matSnackBar: MatSnackBar,
                @Inject(MAT_DIALOG_DATA) public id: string,
                private mDialogRef:MatDialogRef<AddMessageComponent>,
                private fb: FormBuilder) {
        this.batchNames$ = mStudentService.fetchClasses()
        this.form = this.fb.group<any>({
            title: new FormControl('', Validators.required),
            message: new FormControl('', Validators.required),
            messageType: new FormControl('text', Validators.required),
            type: new FormControl('', Validators.required),
            date: new FormControl(new Date(), Validators.required),
            imageUrl: new FormControl(null),
        })
    }

    submit() {

        this.mMessagesService.sendMessage(this.form.value).then(() => {
            this.matSnackBar.open('Message sent successfully')._dismissAfter(3000)
        this.mDialogRef.close()
        }

        ).catch(error=>{
            alert('error occurred!')
        })
    }


}
