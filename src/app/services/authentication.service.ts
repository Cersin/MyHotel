import { Injectable } from '@angular/core';
import { firebase, firestore } from "@nativescript/firebase";
import { User } from "~/app/models/user.model";
import { TNSFancyAlert } from "nativescript-fancyalert";

@Injectable()
export class AuthenticationService {

    constructor() {
    }

    //POBIERA ACCESS KEY Z HOTELOW
    hotelCheckId() {
        return firestore.collection("Hotele").get();
    }

    //DODAJE KLUCZ DO BAZY UZYTKOWNIKA PO ID
    addKeyToUser(key, id) {
        firestore.collection("Users").doc(id).set({
            accessKey: key
        }).then(() => {
            console.log("Klucz dodano");
        })
    }

    // GENERUJE TYMCZASOWE GODZINY DLA KALENDARZA
    addCalendarTimes(id) {
        let i = 0;
        const startDate = new Date;
        const endDate = new Date();
        for (i = 1; i < 30; i++) {
            startDate.setDate(i);
            startDate.setHours(8);
            startDate.setMinutes(0);
            endDate.setDate(i);
            endDate.setHours(16);
            endDate.setMinutes(0);
            firestore.collection("Users").doc(id).collection("calendar").add({
                startDate,
                endDate,
                eventName: "Praca"
            }).then(() => {
                console.log("Dodano zadanie w kalendarzu")})
        }

    }

    //TWORZY UZYTKOWNIKA
    createUser(user: User) {
        console.log(user);
        firebase.createUser({
            email: user.email,
            password: user.password
        }).then((userInfo) => {
            this.addKeyToUser(user.accessKey, userInfo.uid);
            this.addCalendarTimes(userInfo.uid);
            userInfo.displayName = user.displayName;
            console.log(userInfo);
            TNSFancyAlert.showInfo(
                "Konto w MyHotel!",
                "Utwrzono konto dla użytkownika o adresie email: " + user.email,
                "Sprawdź swój email w celu potwierdzenia rejestracji!"
            )
            firebase.sendEmailVerification().then(() => {
                console.log("Mail został wysłany");
            });
        },
            (errorMassage) => {
                TNSFancyAlert.showError(
                    "Nie utworzono konta!",
                    "Konto nie zostało utworzone. Użytkownik o danym adresie email już istnieje, lub podany adres zawiera błąd.",
                    "OK, zamknij!"
                );
            }
            );
    }
}
