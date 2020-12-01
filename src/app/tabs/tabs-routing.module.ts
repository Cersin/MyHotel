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
                path: "browse",
                component: NSEmptyOutletComponent,
                loadChildren: () => import("~/app/pages/browse/browse.module").then((m) => m.BrowseModule),
                outlet: "browseTab"
            },
            {
                path: "search",
                component: NSEmptyOutletComponent,
                loadChildren: () => import("~/app/pages/search/search.module").then((m) => m.SearchModule),
                outlet: "searchTab"
            }

];

@NgModule({
    imports: [NativeScriptRouterModule.forChild(routes)],
    exports: [NativeScriptRouterModule]
})
export class TabsRoutingModule { }
