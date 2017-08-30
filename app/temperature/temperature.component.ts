import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { Router } from "@angular/router";
import { Observable } from "rxjs/Observable";
import { PhotonService, AuthService } from "../services";
import { Http, Response, Headers } from '@angular/http';

@Component({
    selector: "temperature",
    moduleId: module.id,
    templateUrl: "./temperature.component.html",
})
export class TemperatureComponent implements OnInit {
   
    temperature: number = 0;
    recommendation: string = "";
    gradient: string = "";


    //if warm: gradient is red,redorange,orange
    //if warm: recommendation is 'It seems pretty warm in here! Here are some recipes that might be refreshing'

    constructor(private photonService: PhotonService,
                private router: Router,
                private http: Http) 
                {}

    ngOnInit(): void {
        
    }
   
    
    showInfo() {
        alert("Connect to your local hardware device to read your room temperature and get recommended recipes.")
    }
            
}
