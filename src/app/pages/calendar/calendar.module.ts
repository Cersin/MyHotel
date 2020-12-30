import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptCommonModule } from "@nativescript/angular";

import { CalendarRoutingModule } from "./calendar-routing.module";
import { CalendarComponent } from "./calendar.component";
import { NativeScriptUICalendarModule } from "nativescript-ui-calendar/angular";

@NgModule({
    imports: [
        NativeScriptCommonModule,
        CalendarRoutingModule,
        NativeScriptUICalendarModule
    ],
    declarations: [
        CalendarComponent
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
export class CalendarModule { }
