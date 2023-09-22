import {Component} from '@angular/core';
import {catchError, delay, EMPTY, Observable, Subject, takeUntil} from "rxjs";
import {AbstractControl, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {UploadService} from "../../upload/upload.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {GalleryService} from "../../gallery/gallery.service";
import {StudentService} from "../../services/student.service";
import {MatDialogRef} from "@angular/material/dialog";
import {Router} from "@angular/router";
import {SliderService} from "../slider.service";

@Component({
    selector: 'app-add-slider',
    templateUrl: './add-slider.component.html',
    styleUrls: ['./add-slider.component.scss']
})
export class AddSliderComponent {
    destroy$: Subject<void> = new Subject(); // To unsubscribe
    fileToUpload: File | undefined;
    mImagePreview: string | ArrayBuffer | null | undefined;
    mForm: FormGroup;
    submitted = false;
    uploadProgress$: Observable<number> | undefined;

    constructor(
        private readonly formBuilder: FormBuilder,
        private readonly utilService: UploadService,
        private readonly snackBar: MatSnackBar,
        private readonly sliderService: SliderService,
        private readonly mStudentService: StudentService,
        private readonly matDialogRef: MatDialogRef<AddSliderComponent>,
        private readonly storageService: UploadService,
        private readonly router: Router
    ) {
        this.mForm = this.formBuilder.group({
            photo: [null, [Validators.required, this.image.bind(this)]],
            desc: [null, Validators.required],
            // date: new FormControl(new Date(), Validators.required),
            image: [null]
        });
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

    postKitty(): void {
        this.submitted = true;
        const mediaFolderPath = `home-slider`;

        const {downloadUrl$, uploadProgress$} = this.storageService.uploadFileAndGetMetadata(
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
                this.mForm.get('image')?.setValue(res)
                console.log('image uploaded')
                this.sliderService.addImage(this.mForm.value).then(() => {
                    this.snackBar.open('Successful')._dismissAfter(3000)

                    this.matDialogRef.close();

                }).catch(err => {
                    this.snackBar.open('Error Occurred: ' + err)._dismissAfter(3000)
                    delay(3000)
                    {
                        this.matDialogRef.close();
                    }
                })
                // this.router.navigate(['messages']);
            });
    }

}
