import { Component, OnInit } from "@angular/core";
import { firestore } from "@nativescript/firebase";

@Component({
    selector: "Home",
    templateUrl: "./home.component.html"
})
export class HomeComponent implements OnInit {

    collection = [];

    constructor() { }

    ngOnInit(): void {
        // firestore.collection("Amigo123987123987").get()
        //     .then((snapshot) => {
        //         snapshot.forEach((doc) => {
        //             this.collection.push({ uid: doc.id, data: doc.data() });
        //         });
        //     })
        //     .catch(error => console.log(error));

        firestore.collection("Hotele/cPNaEpX2B14UBgpPsYUE/Pokoje").get()
            .then((snapshot) => {
                snapshot.forEach((doc) => {
                    this.collection.push({ uid: doc.id, data: doc.data() });
                });
            })
            .catch(error => console.log(error));
    }



    checkCollection() {
        console.log(this.collection);
    }
}
