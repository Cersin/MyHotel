import { Injectable } from '@angular/core';
import { firebase, firestore } from "@nativescript/firebase";

@Injectable()
export class UpdateDataService {

    updateRoom(accessKey, id) {
        return firestore.collection("Hotele").doc(accessKey).collection("Pokoje").doc(id);
    }
}
