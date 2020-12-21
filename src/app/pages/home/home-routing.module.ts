import { NgModule } from "@angular/core";
import { Routes } from "@angular/router";
import { NativeScriptRouterModule } from "@nativescript/angular";

import { HomeComponent } from "./home.component";
import { RoomEditComponent } from "~/app/shared/roomEdit/roomEdit.component";

const routes: Routes = [
    { path: "", component: HomeComponent },
    { path: "edit", component: RoomEditComponent, loadChildren: () => import("~/app/shared/roomEdit/roomEdit.module").then((m) => m.RoomEditModule) }

];

@NgModule({
    imports: [NativeScriptRouterModule.forChild(routes)],
    exports: [NativeScriptRouterModule]
})
export class HomeRoutingModule { }
