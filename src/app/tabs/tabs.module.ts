import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";

import { TabsRoutingModule } from "./tabs-routing.module";
import { TabsComponent } from "./tabs.component";

@NgModule({
    bootstrap: [
        TabsComponent
    ],
    imports: [
        TabsRoutingModule
    ],
    declarations: [
        TabsComponent
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
export class TabsModule { }
