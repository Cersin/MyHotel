import { Component, OnInit } from "@angular/core";
import { Page } from "@nativescript/core";
import { RouterExtensions } from "@nativescript/angular";
import { ActivatedRoute } from "@angular/router";
import { Room } from "~/app/models/room.model";

@Component({
    selector: "RoomEdit",
    templateUrl: "./roomEdit.component.html",
    styleUrls: ["./roomEdit.component.scss"]
})
export class RoomEditComponent implements OnInit {
    room: Room;
    constructor(private page: Page,
                private _activateRoute: ActivatedRoute,
                private _routerExtension: RouterExtensions) {
        page.actionBarHidden = true;
        const received = this._activateRoute.snapshot.queryParams;
        this.room = JSON.parse(received.room);
        console.log(this.room);
    }

    ngOnInit(): void {
        // Use the "ngOnInit" handler to initialize data for the view.
    }

    goBack() {
        this._routerExtension.backToPreviousPage();
    }
}
