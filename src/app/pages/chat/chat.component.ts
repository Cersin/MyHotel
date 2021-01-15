import { Component, ElementRef, OnInit, ViewChild, ChangeDetectorRef } from "@angular/core";
import { Page } from "@nativescript/core";
import { firebase, firestore } from "@nativescript/firebase";
import { GetDataService } from "~/app/services/getData.service";
import { AddDataService } from "~/app/services/addData.service";
import { Message } from "~/app/models/message.model";
import * as Toast from "nativescript-toasts";

@Component({
    selector: "Chat",
    templateUrl: "./chat.component.html",
    styleUrls: ["./chat.component.scss"]
})
export class ChatComponent implements OnInit {
    noMessage: Toast.ToastOptions = {text: "Musisz wpisać jakąś wiadomość!", duration: Toast.DURATION.SHORT};
    messageSent: Toast.ToastOptions = {text: "Wiadomość wysłano!", duration: Toast.DURATION.SHORT};
    reloaded: Toast.ToastOptions = {text: "Wiadomości przeładowano!", duration: Toast.DURATION.SHORT};

    newMessage: string = "";
    countForMessage: number = 0;
    userUID: firebase.User;
    private accessKey: firestore.DocumentData;
    message: Message;
    messages: Array<Message> = [];
    @ViewChild("ScrollList", {static: true}) private scrollList: ElementRef;

    constructor(private page: Page,
                private getDataService: GetDataService,
                private ref: ChangeDetectorRef,
                private addDataService: AddDataService) {
        // Use the constructor to inject services.
        page.actionBarHidden = true;
    }

    ngOnInit(): void {
        this.loadData();

    }

    reload() {
        this.countForMessage = 1;
        this.loadData();
        Toast.show(this.reloaded);
    }

    send() {
        const time: Date = new Date();
        this.message = {
            message: this.newMessage,
            time: time.getTime(),
            user: this.userUID.displayName
        }
        if (this.newMessage === "") {
            Toast.show(this.noMessage);
        } else {
            this.addDataService.addMessage(this.accessKey.accessKey, this.message);
            Toast.show(this.messageSent);
            this.newMessage = "";
        }
    }

    loadData() {
        // Ustawia ładowanie na true oraz zeruje inne zmienne
        this.accessKey = null;
        this.countForMessage = 1;
        // Pobiera UID
        this.getDataService.getUID().then((user) => {
            this.userUID = user;
            // Pobiera AccessKey
            this.getDataService.getAccessKey(user.uid).get().then((doc) => {
                this.accessKey = doc.data();
            })
                // Pobiera wiadomosci max 20
                .then(() => {
                    this.getDataService.getMessages(this.accessKey.accessKey)
                        .orderBy("message.time", "desc")
                        .limit(20)
                        .onSnapshot({includeMetadataChanges: true}, async (snapshot: firestore.QuerySnapshot) => {
                            const fetchedMessages = [];
                            await snapshot.docSnapshots.forEach((doc) => {
                                if (doc) {
                                    fetchedMessages.push({user: doc.data().message.user,
                                                          message: doc.data().message.message,
                                                          time: new Date(doc.data().message.time)});
                                }
                            })
                            this.messages = fetchedMessages.reverse();
                            await this.ref.detectChanges();
                            this.scrollList.nativeElement.scrollToVerticalOffset(this.scrollList.nativeElement.scrollableHeight, true);
                        })
                })
        })

    }
}
