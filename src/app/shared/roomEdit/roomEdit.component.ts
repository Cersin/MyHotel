import { Component } from "@angular/core";
import { Page } from "@nativescript/core";
import { RouterExtensions } from "@nativescript/angular";
import { ActivatedRoute } from "@angular/router";
import { Room } from "~/app/models/room.model";
import { UpdateDataService } from "~/app/services/updateData.service";
import { ToastDuration, ToastPosition, Toasty } from 'nativescript-toasty-ns-7';

@Component({
    selector: "RoomEdit",
    templateUrl: "./roomEdit.component.html",
    styleUrls: ["./roomEdit.component.scss"]
})
export class RoomEditComponent {
    roomUpdated = new Toasty({text: "Pokój zaktualizowany"});
    room: Room;
    accessKey: any;

    constructor(private page: Page,
                private _activateRoute: ActivatedRoute,
                private updateService: UpdateDataService,
                private _routerExtension: RouterExtensions) {
        page.actionBarHidden = true;
        const received = this._activateRoute.snapshot.queryParams;
        this.room = JSON.parse(received.room);
        this.accessKey = JSON.parse(received.accessKey);
    }

    updateRoom() {
        this.updateService.updateRoom(this.accessKey.accessKey, this.room.id).update({
            stan: {
                klucze: this.room.stan.klucze,
                nowa_posciel: this.room.stan.nowa_posciel,
                odkazone: this.room.stan.odkazone,
                posprzatane: this.room.stan.posprzatane,
                uzupelniona_lodowka: this.room.stan.uzupelniona_lodowka
            },
            wyposazenie: {
                jacuzzi: this.room.wyposazenie.jacuzzi,
                minibar: this.room.wyposazenie.minibar,
                tv: this.room.wyposazenie.tv
            }
        }).then(() => {
            this.roomUpdated.setToastDuration(ToastDuration.SHORT).setToastPosition(ToastPosition.BOTTOM).show();
            this._routerExtension.navigate(["../tabs"], { clearHistory: true });
        }).catch((err) => {
            console.log(err);
        })
    }

    goBack() {
        this._routerExtension.backToPreviousPage();
    }
}
