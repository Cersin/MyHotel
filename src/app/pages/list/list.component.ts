import { ItemEventData } from "@nativescript/core/ui/list-view"
import { Component, OnInit } from "@angular/core";
import { Page } from "@nativescript/core";
import { Hotel } from "~/app/models/hotel.model";
import { firestore } from "@nativescript/firebase";
import { Room } from "~/app/models/room.model";
import { GetDataService } from "~/app/services/getData.service";
import { RouterExtensions } from "@nativescript/angular";
import { Spa } from "~/app/models/spa.model";
import { UpdateDataService } from "~/app/services/updateData.service";
import { ToastDuration, ToastPosition, Toasty } from "nativescript-toasty-ns-7";

@Component({
    selector: "List",
    templateUrl: "./list.component.html",
    styleUrls: ["./list.component.scss"]
})
export class ListComponent implements OnInit {
    spaUpdated = new Toasty({text: "Pokój zaktualizowany"});
    actionBarName: string = "Pokoje";
    rooms: Array<Room> = [];
    spa: firestore.DocumentData = [];
    spaID: string;
    isLoading: boolean = true;
    private accessKey: firestore.DocumentData;

    constructor(private page: Page,
                private getDataService: GetDataService,
                private updateService: UpdateDataService,
                private _routerExtension: RouterExtensions) {
        // Use the component constructor to inject providers.
        page.actionBarHidden = false;
    }

    ngOnInit(): void {
        this.loadData();
    }

    changeView(name) {
        this.actionBarName = name;
        console.log(this.spa);
    }

    check(room: Room) {
        this._routerExtension.navigate(['/edit'], {queryParams: { room: JSON.stringify(room), accessKey: JSON.stringify(this.accessKey) } });
    }

    updateSpa() {
        this.updateService.updateSpa(this.accessKey.accessKey, this.spaID).update({
            Basen: {
                pH: this.spa.Basen.pH,
                temperatura: this.spa.Basen.temperatura,
                czyste_reczniki: this.spa.Basen.czyste_reczniki,
                chlor: this.spa.Basen.chlor
            },
            Sauna: {
                temperatura: this.spa.Sauna.temperatura,
                czyste_reczniki: this.spa.Sauna.czyste_reczniki,
                oleje: this.spa.Sauna.oleje
            }
        }).then(() => {
            this.loadData();
            this.spaUpdated.setToastDuration(ToastDuration.SHORT).setToastPosition(ToastPosition.BOTTOM).show();
        }).catch((err) => {
            console.log(err);
        })
    }

    loadData() {
        // Ustawia ładowanie na true oraz zeruje inne zmienne
        this.isLoading = true;
        this.rooms = [];
        this.accessKey = null;
        // Pobiera UID
        this.getDataService.getUID().then((user) => {
            // Pobiera AccessKey
            this.getDataService.getAccessKey(user.uid).get().then((doc) => {
                this.accessKey = doc.data();
            })
                .then(() => {
                    // Pobiera pokoje o podanych warunkach
                    this.getDataService.getRooms(this.accessKey.accessKey)
                        .orderBy("numer_pokoju", "asc")
                        .get()
                        .then((snapshot) => {
                            snapshot.forEach((doc) => {
                                this.rooms.push({ id: doc.id,
                                                  ilosc_miejsc: doc.data().ilosc_miejsc,
                                                  numer_pokoju: doc.data().numer_pokoju,
                                                  stan: doc.data().stan,
                                                  wyposazenie: doc.data().wyposazenie});
                            })
                        })
                    this.getDataService.getSpa(this.accessKey.accessKey).get()
                        .then((snapshot) => {
                            snapshot.forEach((doc) => {
                                this.spa = doc.data();
                                this.spaID = doc.id;
                            })
                        })

                }).then(() => {
                // Ustawia ładowanie na false
                this.isLoading = false;
            })
        })
    }
}
