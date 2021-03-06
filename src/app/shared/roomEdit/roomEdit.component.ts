import { Component } from "@angular/core";
import { Page } from "@nativescript/core";
import { RouterExtensions } from "@nativescript/angular";
import { ActivatedRoute } from "@angular/router";
import { Room } from "~/app/models/room.model";
import { UpdateDataService } from "~/app/services/updateData.service";
import * as Toast from 'nativescript-toasts';

@Component({
    selector: "RoomEdit",
    templateUrl: "./roomEdit.component.html",
    styleUrls: ["./roomEdit.component.scss"]
})
export class RoomEditComponent {
    roomUpdated: Toast.ToastOptions = {text: "Pokój zaktualizowany", duration: Toast.DURATION.SHORT};
    room: Room;
    accessKey: any;

    constructor(private page: Page,
                private _activateRoute: ActivatedRoute,
                private updateService: UpdateDataService,
                private _activatedRoute: ActivatedRoute,
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
                tv: this.room.wyposazenie.tv,
                klimatyzacja: this.room.wyposazenie.klimatyzacja
            }
        }).then(() => {
            Toast.show(this.roomUpdated);
            this._routerExtension.navigate(["../tabs"], { clearHistory: true, skipLocationChange: true });
        }).catch((err) => {
            console.log(err);
        })
    }

    goBack() {
        this._routerExtension.back({relativeTo: this._activatedRoute});
    }
}
