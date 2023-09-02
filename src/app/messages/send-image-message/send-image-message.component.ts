import { Component, OnDestroy, OnInit } from '@angular/core';
import {catchError, delay, EMPTY, Observable, Subject, takeUntil} from 'rxjs';
import {AbstractControl, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { UploadService } from '../../upload/upload.service';
import {Message} from "../../interfaces/message";
import {StudentService} from "../../services/student.service";
import {MessageService} from "../../services/message.service";

@Component({
  selector: 'app-send-image-message',
  templateUrl: './send-image-message.component.html',
  styleUrls: ['./send-image-message.component.scss']
})
export class SendImageMessageComponent implements OnInit, OnDestroy {
  destroy$: Subject<void> = new Subject(); // To unsubscribe
  fileToUpload: File | undefined;
  mImagePreview: string | ArrayBuffer | null | undefined;
  mForm: FormGroup;
  submitted = false;
  uploadProgress$: Observable<number> | undefined;
    batchNames$: Observable<any>


  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly utilService: UploadService,
    private readonly snackBar: MatSnackBar,
    private readonly messageService:MessageService,
    private readonly mStudentService: StudentService,
    private readonly matDialogRef: MatDialogRef<SendImageMessageComponent>,
    private readonly storageService: UploadService,
    private readonly router: Router
  ) {

    // this.mForm = this.formBuilder.group({
    //   photo: [null, Validators.required, this.image.bind(this)],
    //   title: [null, Validators.required],
    //   message: [null, Validators.required]
    // });
      this.mForm = this.formBuilder.group({
          photo: [null, [Validators.required, this.image.bind(this)]],
          title: [null, Validators.required],
          message: [null, Validators.required],
          type: [null, Validators.required],
          date: new FormControl(new Date(), Validators.required),
          messageType: new FormControl('image', Validators.required),

          imageUrl: [null]
      });
      this.batchNames$ = mStudentService.fetchClasses()

  }

  ngOnInit(): void {
    this.mForm.get('photo')?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((newValue) => {
        this.handleFileChange(newValue.files);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  handleFileChange([kittyImage]: File[]): void {
    this.fileToUpload = kittyImage;
    const reader = new FileReader();
    reader.onload = (loadEvent) => (this.mImagePreview = loadEvent.target?.result);
    reader.readAsDataURL(kittyImage);
  }

  postKitty(): void {
    this.submitted = true;
    const mediaFolderPath = `media`;

    const { downloadUrl$, uploadProgress$ } = this.storageService.uploadFileAndGetMetadata(
      mediaFolderPath,
      this.fileToUpload!
    );

    this.uploadProgress$ = uploadProgress$;

    downloadUrl$
      .pipe(
        takeUntil(this.destroy$),
        catchError((error) => {
          this.snackBar.open(`${error.message} `, 'Close', {
            duration: 4000
          });
          return EMPTY;
        })
      )
      .subscribe(res => {
        this.submitted = false;
       this.mForm.removeControl('photo')
       this.mForm.get('imageUrl')?.setValue(res)
          console.log('image uploaded')
  this.messageService.sendMessage(this.mForm.value).then(()=>{

      this.matDialogRef.close();

  }).catch(err=>{
      this.snackBar.open('Error Occured: '+err)._dismissAfter(3000)
      delay(3000)
      {
          this.matDialogRef.close();
      }
  })
        // this.router.navigate(['messages']);
      });
  }

  private image(photoControl: AbstractControl): { [key: string]: boolean } | null {
    if (photoControl.value) {
      const [kittyImage] = photoControl.value.files;
      return this.utilService.validateFile(kittyImage)
        ? null
        : {
            image: true
          };
    }
    return null;
  }
}
