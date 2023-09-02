import {Component, Inject} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Observable} from "rxjs";
import {StudentService} from "../../services/student.service";
import {MessageService} from "../../services/message.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
    selector: 'app-send-user-message',
    templateUrl: './send-user-message.component.html',
    styleUrls: ['./send-user-message.component.scss']
})
export class SendUserMessageComponent {
    form: FormGroup<any>
    batchNames$: Observable<any>

    constructor(private readonly mStudentService: StudentService,
                private readonly mMessagesService: MessageService,
                private matSnackBar: MatSnackBar,
                private mDialogRef: MatDialogRef<SendUserMessageComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any,

                private fb: FormBuilder) {
        this.batchNames$ = mStudentService.fetchClasses()
        this.form = this.fb.group<any>({
            title: new FormControl('', Validators.required),
            message: new FormControl('', Validators.required),
            messageType: new FormControl('text', Validators.required),
            type: new FormControl('user', Validators.required),
            date: new FormControl(new Date(), Validators.required),
            imageUrl: new FormControl(null),
        })
    }

    submit() {
alert(this.data.rollNo + this.data.type)
        // this.mMessagesService.sendMessage(this.form.value).then(() => {
        //         this.matSnackBar.open('Message sent successfully')._dismissAfter(3000)
        //         this.mDialogRef.close()
        //     }
        // ).catch(error => {
        //     alert('error occurred!')
        // })
    }


}
