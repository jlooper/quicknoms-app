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
    public calibratedrecipes$: Observable<any>;
    recommendation: string = "";
    
    constructor(private recipesService: RecipesService, 
        private router: Router){}

    ngOnInit(): void {
        this.recipesService.getTemperatures(AuthService.deviceId).subscribe((temperature) => {           
            this.temperature$ = temperature[0].temperature;  
            if (Number(this.temperature$) > 70) {
                this.recommendation = "It seems pretty warm in here! I'd recommend some recipes that might be refreshing";                
            } 
            else {
                this.recommendation = "It seems pretty cool in here! I'd recommend some recipes that might be warm and toasty";                           
            }                                          
        })
    }

    findRecipes(temp){
        
        console.log(temp)
        if (temp > 70) {
            this.calibratedrecipes$ = <any>this.recipesService.getCalibratedRecipes("hot");
        } 
        else {
            this.calibratedrecipes$ = <any>this.recipesService.getCalibratedRecipes("cold");     
        } 
              
    }

    goToRecipe(id: string){
        this.router.navigate(["/recipe", id]);
    }
   
    showInfo() {
        alert("Connect to your local hardware device to read your room temperature and get recommended recipes.")
    }
            
}
