import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { Router } from "@angular/router";
import { Observable } from "rxjs/Observable";
import { RecipesService } from "../services/recipes.service";
import bluetooth = require("nativescript-bluetooth");

@Component({
    selector: "bluetooth",
    moduleId: module.id,
    templateUrl: "./bluetooth.component.html",
})
export class BluetoothComponent implements OnInit {
   
    temperature: number;
    recommendation: string = "";
    gradient: string = "";

    //if warm: gradient is red,redorange,orange
    //if warm: recommendation is 'It seems pretty warm in here! Here are some recipes that might be refreshing'

    constructor(private recipeService: RecipesService,
                private router: Router) 
                { 
                    bluetooth.isBluetoothEnabled().then(
                        function(enabled) {
                            console.log("Enabled? " + enabled);
                        }
                    );
                }

    ngOnInit(): void {
        //connect to Estimote beacon
        this.checkBluetooth()
    }

    checkBluetooth(){
        //recommend me a recipe!
        bluetooth.isBluetoothEnabled().then(
            function(enabled) {
                alert("Enabled? " + enabled);
            }
        );
        bluetooth.startScanning({
            serviceUUIDs: [],
            seconds: 4,
        onDiscovered: function (peripheral) {
            console.log("Periperhal found with UUID: " + peripheral.UUID);
            //connect to ng-beacon
            if (peripheral.UUID == 'BA61E22F-764D-82F2-03C3-3B4A899A4AB6'){
                bluetooth.connect({
                    UUID: peripheral.UUID,
                    onConnected: function (peripheral) {
                        console.log("Periperhal connected with UUID: " + peripheral.UUID);
                        // the peripheral object now has a list of available services:
                        peripheral.services.forEach(function(service) {
                        console.log("service found: " + JSON.stringify(service));
                            service.characteristics.forEach(function(characteristics){
                                console.log("characteristics found: " + JSON.stringify(characteristics));
                            })
                    });
                    },
                    onDisconnected: function (peripheral) {
                        console.log("Periperhal disconnected with UUID: " + peripheral.UUID);
                    }
                    });
            }
        }
            }).then(function() {
            console.log("scanning complete");
        }, function (err) {
            console.log("error while scanning: " + err);
        });
    }
    
    showInfo() {
        alert("Connect to an Estimote beacon to read your local temperature and get recommended recipes.")
    }
            
}
