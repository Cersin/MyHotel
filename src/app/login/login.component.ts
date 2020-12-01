import { Component, OnInit } from "@angular/core";

import { DataService, DataItem } from "../shared/data.service";
import { RouterExtensions } from "@nativescript/angular";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
    selector: "Login",
    templateUrl: "./login.component.html"
})
export class LoginComponent implements OnInit {

    constructor(private _routerExtension: RouterExtensions, private _activeRoute: ActivatedRoute, private router: Router) { }

    ngOnInit(): void {
    }

    navigateToHome() {
        this._routerExtension.navigate(['../tabs'], { clearHistory: true, relativeTo: this._activeRoute });

    }
}
