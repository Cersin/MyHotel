import { Injectable } from '@angular/core';
import { firebase, firestore } from "@nativescript/firebase";
import { User } from "~/app/models/user.model";
import { TNSFancyAlert } from "nativescript-fancyalert";
import { ToastDuration, Toasty } from 'nativescript-toasty-ns-7';
import { RouterExtensions } from "@nativescript/angular";
import { ActivatedRoute } from "@angular/router";

@Injectable()
export class AuthenticationService {

    loginToast = new Toasty({text: "Zalogowano pomyślnie"});
    loginErrorToast = new Toasty({text: "Zły adres e-mail lub hasło"});

    constructor(private _routerExtension: RouterExtensions, private _activeRoute: ActivatedRoute) {
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

    canGo(verified) {
        if (verified) {
            this.loginToast.setToastDuration(ToastDuration.SHORT).show();
            this._routerExtension.navigate(['../tabs'], { clearHistory: true, relativeTo: this._activeRoute });
        } else {
            firebase.sendEmailVerification().then(() => {
                console.log("Email został wysłany");
            })
            TNSFancyAlert.showError(
                "Adres e-mail niezweryfikowany",
                "Wysłano potwierdzenie jeszcze raz",
                "Sprawdź skrzynkę"
            )
        }
    }

    // LOGUJE UZYTKOWNIKA
    loginUser(user) {
        firebase.login({
            type: firebase.LoginType.PASSWORD,
            passwordOptions: {
                email: user.email,
                password: user.password
            }
        })
            .then((res) => {
                console.log(res);
                this.canGo(res.emailVerified);
            })
            .catch((error) => {
                console.log(error);
                this.loginErrorToast.setToastDuration(ToastDuration.SHORT).show();
            })
    }

    // Zmienia displayname uzytkownika
    setDisplayName(name) {
        firebase.updateProfile({
            displayName: name
        })
    }

    // TWORZY UZYTKOWNIKA
    createUser(user: User) {
        console.log(user);
        firebase.createUser({
            email: user.email,
            password: user.password
        }).then((userInfo) => {
            this.addKeyToUser(user.accessKey, userInfo.uid);
            this.addCalendarTimes(userInfo.uid);
            this.setDisplayName(user.displayName);
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

    // RESETUJE HASLO
    remindPassword(email) {
        firebase.sendPasswordResetEmail(email)
            .then(() => {
                TNSFancyAlert.showInfo(
                    "Przypomnienie hasła",
                    "Link do zresetowania hasła wysłano na: " + email,
                    "Ok, zamknij!"
                )})
                .catch((error) => {
                    TNSFancyAlert.showError(
                        "Błąd",
                        "Email o podanym adresie nie istnieje lub wystąpił inny błąd",
                        "Ok, zamknij!"
                    )
                })

    }

}
