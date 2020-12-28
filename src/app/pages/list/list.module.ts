import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptCommonModule } from "@nativescript/angular";

import { ListRoutingModule } from "./list-routing.module";
import { ListComponent } from "./list.component";

@NgModule({
    imports: [
        NativeScriptCommonModule,
        ListRoutingModule
    ],
    declarations: [
        ListComponent
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
export class ListModule { }
