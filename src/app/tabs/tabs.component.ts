import { Component, OnInit } from "@angular/core";
import { RouterExtensions } from "@nativescript/angular";
import { ActivatedRoute, Router } from "@angular/router";
import { Page } from "@nativescript/core";

@Component({
    selector: "ns-app",
    templateUrl: "tabs.component.html"
})
export class TabsComponent implements OnInit {

    constructor(private _routerExtension: RouterExtensions,
                private _activeRoute: ActivatedRoute,
                private page: Page) {
        // Use the component constructor to inject providers.
    }

    ngOnInit(): void {
        this.page.actionBarHidden = true;
        this._routerExtension.navigate(
            [{ outlets: { homeTab: ["home"], browseTab: ["browse"], searchTab: ["search"] } }],
            { relativeTo: this._activeRoute }
        );
    }
}
