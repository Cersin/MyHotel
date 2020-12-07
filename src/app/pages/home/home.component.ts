import { Component, OnInit } from "@angular/core";
import { firestore } from "@nativescript/firebase";
import { GetDataService } from "~/app/services/getData.service";

@Component({
    selector: "Home",
    templateUrl: "./home.component.html"
})
export class HomeComponent implements OnInit {

    hotelInfo: {};

    constructor(private getDataService: GetDataService) { }

    ngOnInit(): void {
        setTimeout(() => {
            this.getHotelDetails();
        }, 1000);

        // firestore.collection("Hotele/cPNaEpX2B14UBgpPsYUE/Pokoje").get()
        //     .then((snapshot) => {
        //         snapshot.forEach((doc) => {
        //             this.collection.push({ uid: doc.id, data: doc.data() });
        //         });
        //     })
        //     .catch(error => console.log(error));
    }

    getHotelDetails() {
        this.getDataService.getHotelDetails()
            .then((res) => {
                this.hotelInfo = res.data();
                console.log(res.data());
            });
        }

}
