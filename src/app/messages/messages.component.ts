import {Component, HostListener, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {MatDialog} from "@angular/material/dialog";
import {AddMessageComponent} from "./add-message/add-message.component";
import {Message} from "../interfaces/message";
import {SendImageMessageComponent} from "./send-image-message/send-image-message.component";
import {MatPaginator} from "@angular/material/paginator";
import {AngularFireDatabase} from "@angular/fire/compat/database";

@Component({
    selector: 'app-messages',
    templateUrl: './messages.component.html',
    styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements OnInit {
    messages: Message[] = [];
    dataSource: MatTableDataSource<Message>;
    @ViewChild(MatPaginator) paginator!: MatPaginator;

    // displayedColumns: string[] = ['title', 'message', 'date', 'type','messageType'];
    displayedColumns = window.innerWidth > 600 ? ['title', 'message', 'date', 'type', 'messageType'] : ['title', 'message', 'date','type'];
    @HostListener('window:resize', ['$event'])
    onResize(event: { target: { innerWidth: number; }; }) {
        this.displayedColumns = event.target.innerWidth > 600 ? ['title', 'message', 'date', 'type', 'messageType'] : ['title', 'message', 'date','type'];
    }
    constructor(private firestore: AngularFirestore,
                private  readonly mDatabase:AngularFireDatabase,
                private mDialog: MatDialog) {
        this.dataSource = new MatTableDataSource<any>(this.messages)

    }


    ngOnInit(): void {
        this.fetchMessages()
    }

    fetchMessages() {
        this.mDatabase.list('messages',ref => ref.orderByChild("date"))
        // this.mD.collection('messages',ref => ref.orderBy('date','desc'))
            .valueChanges().subscribe((notifications: any[]) => {
            this.messages = notifications;
            this.dataSource = new MatTableDataSource(this.messages);
        this.dataSource.paginator =this.paginator
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
