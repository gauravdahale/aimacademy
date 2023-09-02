import { Injectable } from '@angular/core';
import {addDoc, collection, Firestore} from "@angular/fire/firestore";
import {Message} from "../interfaces/message";
import {ɵFormGroupValue, ɵTypedOrUntyped} from "@angular/forms";

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  constructor(private  mFirestore:Firestore) { }
sendMessage(formValue:Message){
    console.log(formValue)
    const ref= collection(this.mFirestore,'messages')
 return  addDoc(ref,formValue as Message)
}


    sendUserMessage(value: ɵTypedOrUntyped<any, ɵFormGroupValue<any>, any>) {

    }
}
