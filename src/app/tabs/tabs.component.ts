import { Component, OnInit } from "@angular/core";
import { RouterExtensions } from "@nativescript/angular";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
    selector: "ns-app",
    templateUrl: "tabs.component.html"
})
export class TabsComponent implements OnInit {

    constructor(private _routerExtension: RouterExtensions, private _activeRoute: ActivatedRoute, private router: Router) {
        // Use the component constructor to inject providers.
    }

    ngOnInit(): void {
        this._routerExtension.navigate(
            [{ outlets: { homeTab: ["home"], browseTab: ["browse"], searchTab: ["search"] } }],
            { relativeTo: this._activeRoute }
        );
        // this.router.navigate([{ outlets: { homeTab: ["home"] } }], { relativeTo: this._activeRoute });
        // this._routerExtension.navigate(['home'], { relativeTo: this._activeRoute });

    }
}
