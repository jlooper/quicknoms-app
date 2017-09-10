import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { Router } from "@angular/router";
import { Observable } from "rxjs/Observable";

import { RecipesService, MLService, AuthService } from "../services";

import * as camera from "nativescript-camera";
import { ImageAsset } from "image-asset";
import { ImageSource } from 'image-source';

import { LoadingIndicator } from "nativescript-loading-indicator";

const http = require("http");
const enums = require("ui/enums");

@Component({
    selector: "camera",
    moduleId: module.id,
    templateUrl: "./camera.component.html",
})
export class CameraComponent implements OnInit {

    public recipePic: ImageSource;
    allIngredients: Array<any> = [];

    constructor(private recipeService: RecipesService,
                private router: Router,
                private mlService: MLService) 
                {}

    loader = new LoadingIndicator();

    ngOnInit(): void {
        camera.requestPermissions();
    }

    takePhoto() {
        
        const options: camera.CameraOptions = {
            width: 300,
            height: 300,
            keepAspectRatio: true,
            saveToGallery: false
        };

        camera.takePicture(options)
        .then((imageAsset: ImageAsset) => {
            this.processRecipePic(imageAsset);
        }).catch(err => {
            console.log(err.message);
        });
    
    }
    
    processRecipePic(asset: ImageAsset) {
        const imageSource = new ImageSource();
        imageSource.fromAsset(asset)
        
        .then(image => {
            this.recipePic = image;
            //send to clarif.ai for analysis //png on ios
            const imageAsBase64 = image.toBase64String(enums.ImageFormat.png);
            try {
                this.loader.show({ message: 'Analyzing image...' });
                this.mlService.queryClarifaiAPI(imageAsBase64)
                    .then(res => {
                            this.loader.hide();
                            
                            try {
                                let result = res.content.toJSON();
                                this.allIngredients = result.outputs[0].data.concepts.map( mc => mc.name + ' : ' + mc.value );
                                let ingredients = [];
                                
                                this.allIngredients.forEach(function(entry) {
                                    
                                    let prob = entry.split(' : ');
                                    prob = prob[1];
                                    
                                    let ingred = entry.split(' : ');
                                    if(prob > 0.899){
                                        ingredients.push(ingred[0])
                                    }                                                                        
                                
                                });

                                
                                if (ingredients.length >= 5) {
                                    alert("Yes! This dish might qualify as a QuickNom!")
                                }
                                else {
                                    alert("Hmm. This recipe doesn't have the qualifications of a QuickNom. Try again!")
                                }
                            }
                            catch (e) {
                                console.log('error parsing response: ' + e);
                            }
                            
                        }, e => {
                            console.log("Error occurred " + e);
                        });
                    }
                    catch (e) {
                        this.loader.hide();
                        console.log('error in request: ' + e);
                    }
                });
        }

        
        
    }
