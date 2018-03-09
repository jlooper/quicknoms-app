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
    gradient: string = "";
    coolRecommendation: string = "It seems pretty cool in here! I'd recommend some recipes that might be warm and toasty";
    hotRecommendation: string = "It seems pretty warm in here! I'd recommend some recipes that might be refreshing";
    coolGradient: string = "#05abe0, #53cbf1, #87e0fd";
    hotGradient: string = "#ff6207, #ff731c, #ffe949";
    
    //for demos, change to either F or C for Fahrenheit or Celsius/Centigrade
    mode: string = "F";
    
    constructor(private recipesService: RecipesService, 
        private router: Router){}

    ngOnInit(): void {
        this.recipesService.getTemperatures(AuthService.deviceId).subscribe((temperature) => {           
            this.temperature$ = temperature[0].temperature;            
            this.getRecommendation(this.mode)                                                  
        })
    }

    getRecommendation(mode){
       
        if (mode == 'F'){
            if (Number(this.temperature$) > 70) {
                this.gradient = this.hotGradient;
                this.recommendation = this.hotRecommendation;            
            } 
            else {
                this.gradient = this.coolGradient;
                this.recommendation = this.coolRecommendation;                           
            }
        }
        else {
            if (Number(this.temperature$) > 21) {
                this.gradient = this.hotGradient;
                this.recommendation = this.hotRecommendation; 
            } 
            else {
                this.gradient = this.coolGradient;
                this.recommendation = this.coolRecommendation;                     
            }    
        }    
    }

    findRecipes(temp){
        
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
