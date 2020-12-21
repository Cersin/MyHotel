import { Component, OnInit } from "@angular/core";
import { Page } from "@nativescript/core";
import { RouterExtensions } from "@nativescript/angular";
import { ActivatedRoute } from "@angular/router";

@Component({
    selector: "RoomEdit",
    templateUrl: "./roomEdit.component.html"
})
export class RoomEditComponent implements OnInit {
    room: any;
    constructor(private page: Page, private activateRoute: ActivatedRoute) {
        // Use the component constructor to inject providers.
        page.actionBarHidden = true;
        const received = this.activateRoute.snapshot.queryParams;
        this.room = JSON.parse(received.room);
        console.log(this.room);
       // this.activateRoute.queryParams.subscribe((params) => {
       //      console.log(params);
       //  })

    }

    ngOnInit(): void {
        // Use the "ngOnInit" handler to initialize data for the view.
    }
}
