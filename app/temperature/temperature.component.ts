import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { Router } from "@angular/router";
import { Observable } from "rxjs/Observable";
import { MLService } from "../services";

@Component({
    selector: "temperature",
    moduleId: module.id,
    templateUrl: "./temperature.component.html",
})
export class BluetoothComponent implements OnInit {
   
    temperature: number;
    recommendation: string = "";
    gradient: string = "";

    //if warm: gradient is red,redorange,orange
    //if warm: recommendation is 'It seems pretty warm in here! Here are some recipes that might be refreshing'

    constructor(private mlService: MLService,
                private router: Router) 
                { 
                    
                }

    ngOnInit(): void {
        //connect to Particle
        mlService.getTemperature(){
            
        }
    }

    
    showInfo() {
        alert("Connect to your local hardware device to read your room temperature and get recommended recipes.")
    }
            
}
