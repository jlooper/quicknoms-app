import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { Router } from "@angular/router";
import { Observable } from "rxjs/Observable";
import { RecipesService } from "../services/recipes.service";
import { AuthService } from "../services/auth.service";
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
    
    constructor(private recipeService: RecipesService,
                private router: Router) 
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
            this.updateRecipePic(imageAsset);
        }).catch(err => {
            console.log(err.message);
        });
    
    }
    
    updateRecipePic(asset: ImageAsset) {
        const imageSource = new ImageSource();
        imageSource.fromAsset(asset)
        
        .then(image => {
            this.recipePic = image;
            //send to clarif.ai for analysis //png on ios
            const imageAsBase64 = image.toBase64String(enums.ImageFormat.png);
            console.log('picture b ' + (typeof imageAsBase64));
            console.log('making request ' + imageAsBase64.length);
            try {
                //this.loader.show({ message: 'Analyzing image...' });
            
                        http.request({
                            url: AuthService.clarifaiUrl,
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                "Authorization": "Key " + AuthService.clarifaiKey,
                            },
                            content: JSON.stringify({
                                "inputs": [{
                                    "data": {
                                        "image": {
                                            "base64": imageAsBase64 //"https://samples.clarifai.com/metro-north.jpg"
                                        }
                                    }
                                }]
                            })
                        }).then( response => {
                            console.log('response!!!!');
                            //this.loader.hide();
                            console.log(response.content.toString());
                            try {
                                let result = response.content.toJSON();
                                let tags = result.outputs[0].data.concepts.map( mc => mc.name + '|' + mc.value );
                                let ingredients = [];
                                //console.log(tags);
                                tags.forEach(function(entry) {
                                    console.log(entry);
                                    let prob = entry.split('|');
                                    prob = prob[1];
                                    let ingred = entry.split('|');
                                    if(prob > 0.899){
                                        ingredients.push(ingred[0])
                                    }
                                    console.log(ingredients.length)
                                });
                                if (ingredients.length >= 5) {
                                    alert("Yes! This dish might qualify as a QuickNom! It contains "+ingredients)
                                }
                                else {
                                    alert("Hmm. This recipe doesn't have the qualifications of a QuickNom. Try again!")
                                }
                            }
                            catch (e) {
                                console.log('error parsing response: ' + e);
                            }
                            //console.dir(result);
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
