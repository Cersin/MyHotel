import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";

import { TabsRoutingModule } from "./tabs-routing.module";
import { TabsComponent } from "./tabs.component";
import { HomeModule } from "~/app/pages/home/home.module";

@NgModule({
    bootstrap: [
        TabsComponent
    ],
    imports: [
        TabsRoutingModule,
        HomeModule
    ],
    declarations: [
        TabsComponent
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
export class TabsModule { }
