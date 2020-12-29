import { Injectable } from '@angular/core';
import { firestore } from "@nativescript/firebase";

@Injectable()
export class AddDataService {

    addMessage(accessKey, message) {
        firestore.collection("Hotele").doc(accessKey).collection("chat").add({
            message
        }).then(r => console.log(r)).catch(err => log(err));
    }
}
