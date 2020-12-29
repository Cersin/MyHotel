import { NgModule } from "@angular/core";
import { Routes } from "@angular/router";
import { NativeScriptRouterModule, NSEmptyOutletComponent } from "@nativescript/angular";

const routes: Routes = [
              {path: "", redirectTo: "home", pathMatch: "full"},
            {
                path: "home",
                component: NSEmptyOutletComponent,
                loadChildren: () => import("~/app/pages/home/home.module").then((m) => m.HomeModule),
                outlet: "homeTab"
            },
            {
                path: "list",
                component: NSEmptyOutletComponent,
                loadChildren: () => import("~/app/pages/list/list.module.ts").then((m) => m.ListModule),
                outlet: "listTab"
            },
            {
                path: "chat",
                component: NSEmptyOutletComponent,
                loadChildren: () => import("~/app/pages/chat/chat.module.ts").then((m) => m.ChatModule),
                outlet: "chatTab"
            }

];

@NgModule({
    imports: [NativeScriptRouterModule.forChild(routes)],
    exports: [NativeScriptRouterModule]
})
export class TabsRoutingModule { }
