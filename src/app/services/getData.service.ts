import { Injectable } from '@angular/core';
import { firebase, firestore } from "@nativescript/firebase";

@Injectable()
export class GetDataService {
    userAccessKey: firestore.DocumentData;

    constructor() {
        this.getAccessKey();
    }

    getAccessKey() {

        firebase.getCurrentUser()
            .then((user) => {
                firestore.collection("Users").doc(user.uid).get()
                    .then((doc) => {
                        this.userAccessKey = doc.data();
                    })
                    .catch(error => console.log(error));
            })
    }

    getHotelDetails() {
        return firestore.collection("Hotele").doc(this.userAccessKey.accessKey).get();
    }

}
