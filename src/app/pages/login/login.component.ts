import { Component, OnInit } from "@angular/core";

import { RouterExtensions } from "@nativescript/angular";
import { ActivatedRoute, Router } from "@angular/router";
import { Page } from "@nativescript/core";

@Component({
    selector: "Login",
    templateUrl: "./login.component.html",
    styleUrls: ["./login.component.scss"]
})
export class LoginComponent implements OnInit {

    isLoggingIn: boolean = true;

    constructor(private _routerExtension: RouterExtensions,
                private _activeRoute: ActivatedRoute,
                private page: Page) { }

    ngOnInit(): void {
        this.page.actionBarHidden = true;
    }

    toggleDisplay() {
        this.isLoggingIn = !this.isLoggingIn;
    }

    navigateToHome() {
        this._routerExtension.navigate(['../tabs'], { clearHistory: true, relativeTo: this._activeRoute });

    }
}
