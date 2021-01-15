import { Component, OnInit } from "@angular/core";
import { RouterExtensions } from "@nativescript/angular";
import { ActivatedRoute } from "@angular/router";
import { Page } from "@nativescript/core";
import { User } from "~/app/models/user.model";
import { AuthenticationService } from "~/app/services/authentication.service";
import * as Toast from "nativescript-toasts";
const appSettings = require("@nativescript/core/application-settings");

@Component({
    selector: "Login",
    templateUrl: "./login.component.html",
    styleUrls: ["./login.component.scss"]
})
export class LoginComponent implements OnInit {
    passwordNoMatch: Toast.ToastOptions = {text: "Hasła się nie zgadzają", duration: Toast.DURATION.SHORT};
    accessKeyFail: Toast.ToastOptions = {text: "Niepoprawny klucz dostępu!", duration: Toast.DURATION.SHORT};

    user: User;
    passwordCorrect: string;
    isLoggingIn: boolean = true;
    hotelIds = [];

    constructor(private _routerExtension: RouterExtensions,
                private _activeRoute: ActivatedRoute,
                private page: Page,
                private authenticationService: AuthenticationService) { }

    ngOnInit(): void {
        this.page.actionBarHidden = true;
        this.user = new User();
        this.loadHotelIDs();
        this.user.email = appSettings.getString("email", "");
    }

    toggleDisplay() {
        this.isLoggingIn = !this.isLoggingIn;
    }

    loadHotelIDs() {
        const hotelIDs = [];
        this.authenticationService.hotelCheckId().then((snapshot) => {
                snapshot.forEach((doc) => {
                    hotelIDs.push(doc.id);
                });
            }).then(() => {
                this.hotelIds = hotelIDs;
            })
                .catch(error => console.log(error));
        }

    login() {
        this.authenticationService.loginUser(this.user);
        appSettings.setString("email", this.user.email);
    }

    singUp() {
        if (this.user.password === this.passwordCorrect && this.hotelIds.some(e => e === this.user.accessKey)) {
            this.authenticationService.createUser(this.user);
        }
        else if (this.user.password !== this.passwordCorrect) {
            Toast.show(this.passwordNoMatch);
        }
        else if (!this.hotelIds.some(e => e === this.user.accessKey)) {
            Toast.show(this.accessKeyFail);
        }
    }

    resetPassword() {
        this.authenticationService.remindPassword(this.user.email);
    }

}
