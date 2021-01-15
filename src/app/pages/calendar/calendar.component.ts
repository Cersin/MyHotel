import { Component, OnInit } from "@angular/core";
import { Page } from "@nativescript/core";
import { GetDataService } from "~/app/services/getData.service";
import { CalendarEvent } from "nativescript-ui-calendar";
import { firebase, firestore } from "@nativescript/firebase";

@Component({
    selector: "Calendar",
    templateUrl: "./calendar.component.html",
    styleUrls: ["./calendar.component.scss"]
})
export class CalendarComponent implements OnInit {
    isLoading: boolean = true;
    calendarEvents = [];
    private accessKey: firestore.DocumentData;
    userUID: firebase.User;

    constructor(private page: Page,
                private getDataService: GetDataService) {
        // Use the component constructor to inject providers.
    }

    ngOnInit(): void {
        this.loadData();
    }

    loadData() {
        // Ustawia ładowanie na true oraz zeruje inne zmienne
        this.isLoading = true;
        this.accessKey = null;
        this.userUID = null;
        // Pobiera UID
        this.getDataService.getUID().then((user) => {
            this.userUID = user;
            // Pobiera AccessKey
            this.getDataService.getAccessKey(user.uid).get().then((doc) => {
                this.accessKey = doc.data();
            })
                .then(() => {
                    // Pobiera kalendarz:
                    this.getDataService.getAccessKey(user.uid).collection("calendar")
                        .get()
                        .then((snapshots) => {
                            snapshots.forEach((doc) => {
                                    const startDate: Date = new Date(doc.data().startDate);
                                    const endDate: Date = new Date(doc.data().endDate);
                                    const event = new CalendarEvent(
                                        doc.data().eventName,
                                        startDate,
                                        endDate);
                                    this.calendarEvents.push(event);
                            })
                        })
                }).then(() => {
                // Ustawia ładowanie na false
                this.isLoading = false;
            })
        })
    }
}
