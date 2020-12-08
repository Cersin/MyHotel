import { Component, OnInit } from "@angular/core";
import { firestore } from "@nativescript/firebase";
import { GetDataService } from "~/app/services/getData.service";
import { Hotel } from "~/app/models/hotel.model";
import { ActivityIndicator } from "@nativescript/core/ui/activity-indicator";
import { EventData } from "@nativescript/core";

@Component({
    selector: "Home",
    templateUrl: "./home.component.html"
})
export class HomeComponent implements OnInit {

    hotelInfo: Hotel;
    private accessKey: firestore.DocumentData;
    isLoading: boolean = true;

    constructor(private getDataService: GetDataService) { }

    ngOnInit(): void {
            this.getHotelDetails();
    }

    getHotelDetails() {
        this.isLoading = true;
        this.getDataService.getUID().then((user) => {
            this.getDataService.getAccessKey(user.uid).get().then((doc) => {
                this.accessKey = doc.data();
                })
                .then(() => {
                    this.getDataService.getHotelDetails(this.accessKey.accessKey).then((res) => {
                        this.hotelInfo = res.data();
                    }).then(() => {
                        this.isLoading = false;
                    })
            })
        })
    }

}
