import { Component, OnInit } from "@angular/core";
import {Page} from "@nativescript/core";

@Component({
    selector: "Browse",
    templateUrl: "./browse.component.html"
})
export class BrowseComponent implements OnInit {
    constructor(private page: Page) {
        // Use the component constructor to inject providers.
        page.actionBarHidden = true;
    }

    ngOnInit(): void {
        // Use the "ngOnInit" handler to initialize data for the view.
    }
}
