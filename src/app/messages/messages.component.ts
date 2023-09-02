import {Component, OnInit} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {MatDialog} from "@angular/material/dialog";
import {AddMessageComponent} from "./add-message/add-message.component";
import {Message} from "../interfaces/message";
import {SendImageMessageComponent} from "./send-image-message/send-image-message.component";

@Component({
    selector: 'app-messages',
    templateUrl: './messages.component.html',
    styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements OnInit {
    messages: Message[] = [];
    dataSource: MatTableDataSource<Message>;
    displayedColumns: string[] = ['title', 'message', 'date', 'type','messageType'];

    constructor(private firestore: AngularFirestore,
                private mDialog: MatDialog) {
        this.dataSource = new MatTableDataSource<any>(this.messages)

    }


    ngOnInit(): void {
        this.fetchMessages()
    }

    fetchMessages() {
        this.firestore.collection('messages',ref => ref.orderBy('date','desc')).valueChanges().subscribe((notifications: any[]) => {
            this.messages = notifications;
            this.dataSource = new MatTableDataSource(this.messages);
        });
    }

    OpenSendMessage() {
        this.mDialog.open(AddMessageComponent, {
            autoFocus: false,
        })
    }

    SendImageMessage() {
        this.mDialog.open(SendImageMessageComponent, {
            width:'80%',
            autoFocus: false,
            // disableClose: true
        })
    }
}
