import { NgModule } from "@angular/core";
import { Routes } from "@angular/router";
import { NativeScriptRouterModule } from "@nativescript/angular";

import { RoomEditComponent } from "./roomEdit.component";

const routes: Routes = [
    { path: "", component: RoomEditComponent }
];

@NgModule({
    imports: [NativeScriptRouterModule.forChild(routes)],
    exports: [NativeScriptRouterModule]
})
export class RoomEditRoutingModule { }
