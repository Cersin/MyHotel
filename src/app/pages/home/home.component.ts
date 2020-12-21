import { Component, OnInit } from "@angular/core";
import { firebase, firestore } from "@nativescript/firebase";
import { GetDataService } from "~/app/services/getData.service";
import { Hotel } from "~/app/models/hotel.model";
import { CommonModule } from "@angular/common";
import { ActivityIndicator } from "@nativescript/core/ui/activity-indicator";
import { Page } from "@nativescript/core";
import { RouterExtensions } from "@nativescript/angular";
import { Room } from "~/app/models/room.model";
import { Router } from "@angular/router";
import { stringify } from "@angular/compiler/src/util";

@Component({
    selector: "Home",
    templateUrl: "./home.component.html",
    styleUrls: ["./home.component.scss"]
})
export class HomeComponent implements OnInit {

    timeNow = new Date();
    calendar: firestore.DocumentData = [];
    hotelInfo: Hotel;
    rooms: Array<Room> = [];
    private accessKey: firestore.DocumentData;
    userUID: firebase.User;
    isLoading: boolean = true;

    constructor(private getDataService: GetDataService,
                private _routerExtension: RouterExtensions,
                page: Page) {
        page.actionBarHidden = true;
    }

    ngOnInit(): void {
            this.loadData();
    }

    check(room: Room) {
        this._routerExtension.navigate(['/edit'], {queryParams: { room: JSON.stringify(room) } });
    }

    loadData() {
        // Ustawia ładowanie na true
        this.isLoading = true;
        // Pobiera UID
        this.getDataService.getUID().then((user) => {
            this.userUID = user;
            // Pobiera AccessKey
            this.getDataService.getAccessKey(user.uid).get().then((doc) => {
                this.accessKey = doc.data();
                })
                .then(() => {
                    // Pobiera godzine pracy na dzis:
                    this.getDataService.getAccessKey(user.uid).collection("calendar")
                        .get()
                        .then((snapshots) => {
                            snapshots.forEach((doc) => {
                                if (doc.data().startDate.getDate() === this.timeNow.getDate() &&
                                    doc.data().startDate.getMonth() === this.timeNow.getMonth() &&
                                    doc.data().startDate.getFullYear() === this.timeNow.getFullYear()) {
                                    this.calendar = doc.data();
                                }
                            })
                        })
                    // Pobiera detale hotelu(adres,numer)
                    this.getDataService.getHotelDetails(this.accessKey.accessKey)
                        .then((res) => {
                        this.hotelInfo = res.data() as Hotel;
                    })
                    // Pobiera pokoje o podanych warunkach
                    this.getDataService.getRooms(this.accessKey.accessKey)
                        .where("stan.klucze", "==", true)
                        .where("stan.odkazone", "==", false)
                        .orderBy("numer_pokoju", "asc")
                        .get()
                        .then((snapshot) => {
                        snapshot.forEach((doc) => {
                            this.rooms.push({ id: doc.id,
                                              ilosc_miejsc: doc.data().ilosc_miejsc,
                                              numer_pokoju: doc.data().numer_pokoju,
                                              stan: doc.data().stan,
                                              wyposazenie: doc.data().wyposazenie});
                        })
                    })
            }).then(() => {
                // Ustawia ładowanie na false
                this.isLoading = false;
            })
        })
    }

    logout() {
        firebase.logout().then(() => {
            console.log("Wylogowano");
            this._routerExtension.navigate(['/login'], { clearHistory: true });
        }).catch((e) => {
            console.log(e);
        })
    }

}
