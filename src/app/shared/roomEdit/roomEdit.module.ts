import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptCommonModule } from "@nativescript/angular";

import { RoomEditRoutingModule } from "./roomEdit-routing.module";
import { RoomEditComponent } from "./roomEdit.component";

@NgModule({
    imports: [
        NativeScriptCommonModule,
        RoomEditRoutingModule
    ],
    declarations: [
        RoomEditComponent
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
export class RoomEditModule { }
