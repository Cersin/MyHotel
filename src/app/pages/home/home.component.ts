import { Component, OnInit } from "@angular/core";
import { firebase, firestore} from "@nativescript/firebase";
import { GetDataService } from "~/app/services/getData.service";
import { Hotel } from "~/app/models/hotel.model";
import { CommonModule } from "@angular/common";
import { ActivityIndicator } from "@nativescript/core/ui/activity-indicator";
import { EventData } from "@nativescript/core";

@Component({
    selector: "Home",
    templateUrl: "./home.component.html",
    styleUrls: ["./home.component.scss"]
})
export class HomeComponent implements OnInit {

    timeNow = new Date();
    calendar: firestore.DocumentData = [];
    hotelInfo: Hotel;
    rooms = [];
    private accessKey: firestore.DocumentData;
    userUID: firebase.User;
    isLoading: boolean = true;

    constructor(private getDataService: GetDataService) { }

    ngOnInit(): void {
            this.loadData();
    }

    test() {
        console.log(this.calendar);
    }

    loadData() {
        console.log(this.timeNow.getDate());
        console.log(this.timeNow.getMonth());
        console.log(this.timeNow.getFullYear());
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
                        // .where("startDate.getDate()", "==", this.timeNow.getDate())
                        // .where("endDate.getMonth()", "==", this.timeNow.getMonth())
                        // .where("endDate.getFullYear()", "==", this.timeNow.getFullYear())
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
                            this.rooms.push({ id: doc.id, data: doc.data()});
                            // console.log({id: doc.id, data: doc.data()});
                        })
                    })
            }).then(() => {
                // Ustawia ładowanie na false
                this.isLoading = false;
            })
        })
    }

}
