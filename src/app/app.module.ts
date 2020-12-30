import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptCommonModule, NativeScriptModule } from "@nativescript/angular";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { AuthenticationService } from "~/app/services/authentication.service";
import { GetDataService } from "~/app/services/getData.service";
import { CommonModule } from "@angular/common";
import { TabsModule } from "~/app/tabs/tabs.module";
import { UpdateDataService } from "~/app/services/updateData.service";
import { AddDataService } from "~/app/services/addData.service";

@NgModule({
    bootstrap: [
        AppComponent
    ],
    imports: [
        NativeScriptModule,
        AppRoutingModule,
        NativeScriptCommonModule,
        CommonModule,
        TabsModule
    ],
    declarations: [
        AppComponent
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ],
    providers: [
        AuthenticationService,
        GetDataService,
        UpdateDataService,
        AddDataService
    ]
})
export class AppModule { }
