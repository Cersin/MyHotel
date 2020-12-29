import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import {NativeScriptCommonModule, NativeScriptFormsModule} from "@nativescript/angular";

import { ChatRoutingModule } from "./chat-routing.module";
import { ChatComponent } from "./chat.component";

@NgModule({
    imports: [
        NativeScriptCommonModule,
        ChatRoutingModule,
        NativeScriptFormsModule
    ],
    declarations: [
        ChatComponent
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
export class ChatModule { }
