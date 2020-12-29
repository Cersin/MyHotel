import { Component, OnInit } from "@angular/core";
import { Page } from "@nativescript/core";
import { firebase, firestore } from "@nativescript/firebase";
import { GetDataService } from "~/app/services/getData.service";
import { AddDataService } from "~/app/services/addData.service";
import { Message } from "~/app/models/message.model";
import { LocalNotifications } from "nativescript-local-notifications";

@Component({
    selector: "Search",
    templateUrl: "./search.component.html"
})
export class SearchComponent implements OnInit {
    countForMessage: number = 0;
    isLoading: boolean = true;
    private userUID: firebase.User;
    private accessKey: firestore.DocumentData;
    message: Message;
    messages: Array<Message> = [];

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

    check() {
        this.loadData();
    }

    reverse() {
        this.messages.reverse();
    }

    add() {
        const time: Date = new Date();
        this.message = {
            message: "ppssst",
            hours: time.getHours(),
            minutes: time.getMinutes(),
            time: time.getTime(),
            user: this.userUID.displayName
        }
        this.addDataService.addMessage(this.accessKey.accessKey, this.message);
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
        this.isLoading = true;
        this.accessKey = null;
        // Pobiera UID
        this.getDataService.getUID().then((user) => {
            this.userUID = user;
            // Pobiera AccessKey
            this.getDataService.getAccessKey(user.uid).get().then((doc) => {
                this.accessKey = doc.data();
            })
                .then(() => {
                    const snapshoting = this.getDataService.getMessages(this.accessKey.accessKey)
                        .orderBy("message.time", "desc")
                        .limit(5)
                        .onSnapshot({includeMetadataChanges: true}, (snapshot: firestore.QuerySnapshot) => {
                            this.messages = [];
                            snapshot.forEach((doc) => {
                                this.messages.push(<Message>doc.data().message);
                            })
                            if (!snapshot.metadata.fromCache) {
                                snapshot.docChanges().forEach((doc) => {
                                    if (doc.type === "added") {
                                        if (doc.doc.data().message.user !== this.userUID.displayName && this.countForMessage !== 1) {
                                            this.countForMessage++;
                                            this.setUpNotification();
                                            console.log("Coś nowego");
                                        }
                                    }
                                })
                            }
                    })
                }).then(() => {
                // Ustawia ładowanie na false
                this.isLoading = false;
            })
        })
    }

}
