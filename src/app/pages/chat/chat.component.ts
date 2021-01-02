import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { Page } from "@nativescript/core";
import { firebase, firestore } from "@nativescript/firebase";
import { GetDataService } from "~/app/services/getData.service";
import { AddDataService } from "~/app/services/addData.service";
import { Message } from "~/app/models/message.model";
import { LocalNotifications } from "nativescript-local-notifications";
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
    @ViewChild("ScrollList", { static: true }) private scrollList: ElementRef;

    constructor(private page: Page,
                private getDataService: GetDataService,
                private addDataService: AddDataService) {
        // Use the constructor to inject services.
        page.actionBarHidden = true;
        LocalNotifications.hasPermission().then(() => {
            console.log("ok, ma pozwolenie");
        }).catch(() => {
            LocalNotifications.requestPermission().then(() => {
                console.log("Ok mamy pozwolenie");
            })
        })

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
            hours: time.getHours(),
            minutes: time.getMinutes(),
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

    setUpNotification() {
        LocalNotifications.schedule([{
            id: 100, // generated id if not set
            title: 'Nowa wiadomość',
            body: 'Odśwież wiadomości',
            ongoing: true, // makes the notification ongoing (Android only)
            at: new Date(new Date().getTime() + (1000)) // 1s from now
        }]).then(
            (scheduledIds) => {
                console.log("Notification id(s) scheduled: " + JSON.stringify(scheduledIds));
            },
            (error) => {
                console.log("scheduling error: " + error);
            }
        )
    }

    loadData() {
        // Ustawia ładowanie na true oraz zeruje inne zmienne
        this.accessKey = null;
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
                        .onSnapshot({includeMetadataChanges: true}, (snapshot: firestore.QuerySnapshot) => {
                            this.messages = [];
                            snapshot.forEach((doc) => {
                                this.messages.push(<Message>doc.data().message);
                                setTimeout(() => {
                                    this.scrollList.nativeElement.scrollToVerticalOffset(this.scrollList.nativeElement.scrollableHeight, true);
                                }, 500);
                            })
                            if (!snapshot.metadata.fromCache) {
                                snapshot.docChanges().forEach((doc) => {
                                    if (doc.type === "added") {
                                        if (doc.doc.data().message.user !== this.userUID.displayName && this.countForMessage !== 1) {
                                            this.countForMessage++;
                                            this.scrollList.nativeElement.scrollToVerticalOffset(this.scrollList.nativeElement.scrollableHeight, true);
                                            this.setUpNotification();
                                        }
                                    }
                                })
                            }
                    })
                }).then(() => {
                    setTimeout(() => {
                        this.scrollList.nativeElement.scrollToVerticalOffset(this.scrollList.nativeElement.scrollableHeight, true);
                    }, 5000)
            })
        })
    }

}
