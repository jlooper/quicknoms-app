import { NgModule } from "@angular/core";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { Routes } from "@angular/router";

import { RecipesComponent } from "./recipes/recipes.component";
import { RecipeDetailComponent } from "./recipe-detail/recipe-detail.component";
import { HomeComponent } from "./home/home.component";
import { RecipeSearchComponent } from "./recipe-search/recipe-search.component";
import { BluetoothComponent } from "./bluetooth/bluetooth.component";
import { CameraComponent } from "./camera/camera.component";
import { StoreComponent } from "./store/store.component";


const routes: Routes = [
    { path: "", component: HomeComponent, pathMatch: "full" },
    { path: "recipes/:category", component: RecipesComponent },
    { path: "search", component: RecipeSearchComponent },
    { path: "bluetooth", component: BluetoothComponent },
    { path: "camera", component: CameraComponent },
    { path: "store", component: StoreComponent },
    { path: "recipe/:id", component: RecipeDetailComponent },
];

@NgModule({
    imports: [NativeScriptRouterModule.forRoot(routes)],
    exports: [NativeScriptRouterModule]
})
export class AppRoutingModule { }