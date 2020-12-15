import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptCommonModule, NativeScriptModule } from "@nativescript/angular";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { AuthenticationService } from "~/app/services/authentication.service";
import { GetDataService } from "~/app/services/getData.service";
import { CommonModule } from "@angular/common";

@NgModule({
    bootstrap: [
        AppComponent
    ],
    imports: [
        NativeScriptModule,
        AppRoutingModule,
        NativeScriptCommonModule,
        CommonModule
    ],
    declarations: [
        AppComponent
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ],
    providers: [
        AuthenticationService,
        GetDataService
    ]
})
export class AppModule { }
