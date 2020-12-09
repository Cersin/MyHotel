import { Injectable } from '@angular/core';
import { firebase, firestore } from "@nativescript/firebase";

@Injectable()
export class GetDataService {

    constructor() {
    }

    getUID() {
        return firebase.getCurrentUser();
    }

    getAccessKey(userUID) {
        return firestore.collection("Users").doc(userUID);
    }

    getHotelDetails(accessKey) {
        return firestore.collection("Hotele").doc(accessKey).get();
    }

    getRooms(accessKey) {
        return firestore.collection("Hotele").doc(accessKey).collection("Pokoje");
    }

}
