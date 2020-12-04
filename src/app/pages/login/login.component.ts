import { Component, OnInit } from "@angular/core";
import { ToastDuration, ToastPosition, Toasty } from 'nativescript-toasty-ns-7';
import { RouterExtensions } from "@nativescript/angular";
import { ActivatedRoute } from "@angular/router";
import { Page } from "@nativescript/core";
import { User } from "~/app/models/user.model";
import { AuthenticationService } from "~/app/services/authentication.service";

@Component({
    selector: "Login",
    templateUrl: "./login.component.html",
    styleUrls: ["./login.component.scss"]
})
export class LoginComponent implements OnInit {

    passwordNoMatch = new Toasty({text: "Hasła się nie zgadzają"});
    accessKeyFail = new Toasty({text: "Niepoprawny klucz dostępu!"});

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
                console.log(hotelIDs);
                this.hotelIds = hotelIDs;
                console.log(this.hotelIds.some(e => e === this.user.accessKey));

            })
                .catch(error => console.log(error));
        }

    login() {
        this.authenticationService.loginUser(this.user);
    }

    singUp() {
        if (this.user.password === this.passwordCorrect && this.hotelIds.some(e => e === this.user.accessKey)) {
            this.authenticationService.createUser(this.user);
        }
        else if (this.user.password !== this.passwordCorrect) {
            this.passwordNoMatch.setToastDuration(ToastDuration.SHORT).setToastPosition(ToastPosition.BOTTOM).show();
        }
        else if (!this.hotelIds.some(e => e === this.user.accessKey)) {
            this.accessKeyFail.setToastDuration(ToastDuration.SHORT).show();
        }
    }

    resetPassword() {
        this.authenticationService.remindPassword(this.user.email);
    }

    navigateToHome() {
        this._routerExtension.navigate(['../tabs'], { clearHistory: true, relativeTo: this._activeRoute });

    }
}
