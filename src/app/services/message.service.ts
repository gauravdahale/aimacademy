import { Injectable } from '@angular/core';
import {addDoc, collection, Firestore} from "@angular/fire/firestore";
import {Message} from "../interfaces/message";
import {ɵFormGroupValue, ɵTypedOrUntyped} from "@angular/forms";
import {Database, push, ref, set} from "@angular/fire/database";

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  constructor(private  mFirestore:Firestore,
  private mDatabase:Database) { }
sendMessage(formValue:Message){
    console.log(formValue)
    const mRef= ref(this.mDatabase,'messages')
  return  push(mRef,formValue as Message)
}


    sendUserMessage(rollNo:String, value: ɵTypedOrUntyped<any, ɵFormGroupValue<any>, any>) {
        const mRef= ref(this.mDatabase,'userNotifications')
        return  push(mRef,value as Message)
    }
}
