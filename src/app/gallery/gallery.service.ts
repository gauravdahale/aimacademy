import {Injectable} from '@angular/core';
import {ɵFormGroupValue, ɵTypedOrUntyped} from "@angular/forms";
import {addDoc, collection, collectionData, Firestore} from "@angular/fire/firestore";
import {Message} from "../interfaces/message";
import {getStorage, Storage} from "@angular/fire/storage";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {AngularFireStorage} from "@angular/fire/compat/storage";

@Injectable({
    providedIn: 'root'
})
export class GalleryService {

    constructor(private mFirestore: Firestore,
                private mStorage:AngularFireStorage) {
    }

    addImage(value: ɵTypedOrUntyped<any, ɵFormGroupValue<any>, any>) {
        console.log(value)
        const ref = collection(this.mFirestore, 'gallery')
        return addDoc(ref, value)
    }

    getData() {
        const ref = collection(this.mFirestore, 'gallery')
        return collectionData(ref,{idField:'id'})
    }

    deleteImageFromStorage(id: string, url: any): Promise<void> {
        const storageRef = this.mStorage.refFromURL(url);
        // const storageRef = getStorage(this.mStorage,imagePath)
       return   storageRef.delete().toPromise()
    }

}
