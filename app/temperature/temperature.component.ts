import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { Router } from "@angular/router";
import { Observable } from "rxjs/Observable";
import { RecipesService, AuthService } from "../services";
import { Http, Response, Headers } from '@angular/http';

@Component({
    selector: "temperature",
    moduleId: module.id,
    templateUrl: "./temperature.component.html",
})
export class TemperatureComponent implements OnInit {    
  
    public temperature$: Observable<any>;
    public recipes$: Observable<any>;
    recommendation: string = "";
    gradient: string = "";
   
    constructor(private recipesService: RecipesService, 
        private router: Router){}

    ngOnInit(): void {
        //this.temperatures$ = <any>this.recipesService.getTemperatures(AuthService.deviceId)
        this.recipesService.getTemperatures(AuthService.deviceId).subscribe((temperature) => {
            console.log(JSON.stringify(temperature))
            this.temperature$ = temperature[0].temperature;
            if (Number(this.temperature$) > 70) {
                this.gradient = "red,redorange,orange";
                this.recommendation = "It seems pretty warm in here! Here are some recipes that might be refreshing";
                this.getRecipes("hot");
            }  
            else {
                this.gradient = "skyblue,lightskyblue,white";
                this.recommendation = "It seems pretty cool in here! Here are some recipes that might be warm and toasty";
                this.getRecipes("cold");
            }           
        })
    }

    getRecipes(temp){
         this.recipes$ = <any>this.recipesService.getCalibratedRecipes(temp);
    }

    goToRecipe(id: string){
        this.router.navigate(["/recipe", id]);
    }
   
    showInfo() {
        alert("Connect to your local hardware device to read your room temperature and get recommended recipes.")
    }
            
}
