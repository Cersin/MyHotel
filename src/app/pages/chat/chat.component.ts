import { Component, ElementRef, OnInit, ViewChild, ChangeDetectorRef } from "@angular/core";
import { Page } from "@nativescript/core";
import { firebase, firestore } from "@nativescript/firebase";
import { GetDataService } from "~/app/services/getData.service";
import { AddDataService } from "~/app/services/addData.service";
import { Message } from "~/app/models/message.model";
import { ToastDuration, ToastPosition, Toasty } from "@triniwiz/nativescript-toasty";

@Component({
    selector: "Chat",
    templateUrl: "./chat.component.html",
    styleUrls: ["./chat.component.scss"]
})
export class ChatComponent implements OnInit {
    noMessage = new Toasty({text: "Musisz wpisać jakąś wiadomość!"});
    messageSent = new Toasty({text: "Wiadomość wysłano!"});
    reloaded = new Toasty({text: "Wiadomości przeładowano!"});
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
        this.reloaded.setToastDuration(ToastDuration.SHORT).setToastPosition(ToastPosition.BOTTOM).show();
    }

    send() {
        const time: Date = new Date();
        this.message = {
            message: this.newMessage,
            time: time.getTime(),
            user: this.userUID.displayName
        }
        if (this.newMessage === "") {
            this.noMessage.setToastDuration(ToastDuration.SHORT).setToastPosition(ToastPosition.BOTTOM).show();
        } else {
            this.addDataService.addMessage(this.accessKey.accessKey, this.message);
            this.messageSent.setToastDuration(ToastDuration.SHORT).setToastPosition(ToastPosition.BOTTOM).show();
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
