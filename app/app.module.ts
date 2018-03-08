import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptModule } from "nativescript-angular/nativescript.module";
import { NativeScriptHttpModule } from "nativescript-angular/http";
import { AppRoutingModule } from "./app.routing";
import { AppComponent } from "./app.component";

import { RecipesService, FilesService, AuthService, MLService } from "./services";

import { RecipesComponent } from "./recipes/recipes.component";
import { RecipeDetailComponent } from "./recipe-detail/recipe-detail.component";
import { HomeComponent } from "./home/home.component";
import { TemperatureComponent } from "./temperature/temperature.component";
import { CameraComponent } from "./camera/camera.component";
import { StoreComponent } from "./store/store.component";
import { RecipeSearchComponent } from "./recipe-search/recipe-search.component";


//plugins
import { registerElement } from "nativescript-angular/element-registry";
registerElement("Gradient", () => require("nativescript-gradient").Gradient);
import {TNSFontIconModule, TNSFontIconService, TNSFontIconPipe, TNSFontIconPurePipe} from 'nativescript-ngx-fonticon';
import { NativeScriptUISideDrawerModule } from "nativescript-ui-sidedrawer/angular";

import firebase = require("nativescript-plugin-firebase");
firebase.init({
  persist: true
}).then(
  (instance) => {
    console.log("firebase.init done");
  },
  (error) => {
    console.log("firebase.init error: " + error);
  }
);


@NgModule({
    bootstrap: [
        AppComponent
    ],
    imports: [
        NativeScriptModule,
        NativeScriptUISideDrawerModule,
        NativeScriptHttpModule,
        AppRoutingModule,
        TNSFontIconModule.forRoot({
            'fa': 'fonts/font-awesome.css',
            'ion': 'fonts/ionicons.css'
        })
    ],
    declarations: [
        AppComponent,
        HomeComponent,
        TemperatureComponent,
        CameraComponent,
        RecipesComponent,
        RecipeSearchComponent,
        RecipeDetailComponent,
        StoreComponent
    ],
    providers: [
        RecipesService,
        FilesService,
        AuthService,
        MLService 
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
export class AppModule { }
