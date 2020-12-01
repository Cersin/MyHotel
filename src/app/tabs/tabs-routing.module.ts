import { NgModule } from "@angular/core";
import { Routes } from "@angular/router";
import { NativeScriptRouterModule, NSEmptyOutletComponent } from "@nativescript/angular";
import { TabsComponent } from "~/app/tabs/tabs.component";

const routes: Routes = [
    // {
    //      path: "tabs",
    //      redirectTo: "/(homeTab:home/default//browseTab:browse/default//searchTab:search/default)",
    //      pathMatch: "full"
    //  },

    {path: "", redirectTo: "home", pathMatch: "full"},
            {
                path: "home",
                component: NSEmptyOutletComponent,
                loadChildren: () => import("~/app/home/home.module").then((m) => m.HomeModule),
                outlet: "homeTab"
            },
            {
                path: "browse",
                component: NSEmptyOutletComponent,
                loadChildren: () => import("~/app/browse/browse.module").then((m) => m.BrowseModule),
                outlet: "browseTab"
            },
            {
                path: "search",
                component: NSEmptyOutletComponent,
                loadChildren: () => import("~/app/search/search.module").then((m) => m.SearchModule),
                outlet: "searchTab"
            }

];

@NgModule({
    imports: [NativeScriptRouterModule.forChild(routes)],
    exports: [NativeScriptRouterModule]
})
export class TabsRoutingModule { }
