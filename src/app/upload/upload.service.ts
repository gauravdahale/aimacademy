import { Injectable } from '@angular/core';
import {from, Observable, switchMap} from "rxjs";
import {AngularFireStorage, AngularFireUploadTask} from "@angular/fire/compat/storage";
export interface FilesUploadMetadata {
  uploadProgress$: Observable<number>;
  downloadUrl$: Observable<string>;
}
@Injectable({
  providedIn: 'root'
})
export class UploadService {
  private imageOrVideoFileTypes = [
    'application/ogg',
    'application/vnd.apple.mpegurl',
    'application/x-mpegURL',
    'image/apng',
    'image/bmp',
    'image/gif',
    'image/jpeg',
    'image/png',
    'image/svg+xml',
    'image/tiff',
    'image/webp',
    'image/x-icon',
  ];
  constructor(private readonly storage: AngularFireStorage) { }
  uploadFileAndGetMetadata(mediaFolderPath: string, fileToUpload: File): FilesUploadMetadata {
    const { name } = fileToUpload;
    const filePath = `${mediaFolderPath}/${new Date().getTime()}_${name}`;
    const uploadTask: AngularFireUploadTask = this.storage.upload(filePath, fileToUpload);
    return {
      // @ts-ignore
      uploadProgress$: uploadTask.percentageChanges(),
      downloadUrl$: this.getDownloadUrl$(uploadTask, filePath),
    };
  }

  private getDownloadUrl$(uploadTask: AngularFireUploadTask, path: string): Observable<string> {
    return from(uploadTask).pipe(switchMap((_) => this.storage.ref(path).getDownloadURL()));
  }


  validateFile(file: File): boolean {
    return this.imageOrVideoFileTypes.includes(file.type);
  }


}
