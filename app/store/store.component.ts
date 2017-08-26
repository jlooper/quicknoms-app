import { Component, OnInit, NgZone, ViewChild, ElementRef } from "@angular/core";
import { Router } from "@angular/router";
import { Observable } from "rxjs/Observable";
import { AuthService } from "../services/auth.service";
import * as camera from "nativescript-camera";
import { ImageAsset } from "image-asset";
import { ImageSource } from 'image-source';
import { LoadingIndicator } from "nativescript-loading-indicator";
import { Algolia } from "nativescript-algolia";

import "rxjs/add/operator/do";
import "rxjs/add/operator/map";
import "rxjs/add/observable/throw";
import "rxjs/add/operator/catch";

const http = require("http");
const enums = require("ui/enums");

@Component({
    selector: "store",
    moduleId: module.id,
    templateUrl: "./store.component.html",
})
export class StoreComponent implements OnInit {

    public itemPic: ImageSource;
    recipes: Array<any> = [];
    ingredient: string;
    
    constructor(private router: Router, private ngZone: NgZone) 
                {}

    loader = new LoadingIndicator();
    client = new Algolia(AuthService.algoliaAppId, AuthService.algoliaKey);
    index = this.client.initIndex("recipes");
    

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
            this.updateItemPic(imageAsset);
        }).catch(err => {
            console.log(err.message);
        });
    
    }
    
    updateItemPic(asset: ImageAsset) {
        const imageSource = new ImageSource();
        imageSource.fromAsset(asset)
        
        .then (image => {
            this.itemPic = image;
            //send to Google for analysis //png on ios
            const imageAsBase64 = image.toBase64String(enums.ImageFormat.png);
            try {
                this.loader.show({ message: 'Analyzing image...' });
            
                        http.request({
                            url: "https://vision.googleapis.com/v1/images:annotate?key="+AuthService.googleKey,
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                "Content-Length": imageAsBase64.length,
                            },
                            content: JSON.stringify({
                                "requests": [{
                                        "image": {
                                            "content": imageAsBase64 
                                        },
                                        "features" : [
                                        {
                                            "type":"LABEL_DETECTION",
                                            "maxResults":1
                                        }
                                    ]                      
                                }]
                            })
                        }).then( response => {                        
                            try {
                                let result = response.content.toJSON();
                                this.ingredient = result.responses[0].labelAnnotations.map( mc => mc.description );
                                
                                
                                this.ngZone.run(() => {
                                    this.loader.hide();
                                    this.searchRecipes(this.ingredient)
                                })
                            }
                            catch (e) {
                                console.log('error parsing response: ' + e);
                            }
                        }, e => {
                            this.loader.hide();
                            console.log("Error occurred " + e);
                        });
                    }
                    catch (e) {
                        this.loader.hide();
                        console.log('error in request: ' + e);
                    }
                });
        }

        searchRecipes(ingredient) {
            
            console.log("searching for..." + ingredient)
            this.loader.show({ message: 'Looking for recipes using ' + ingredient});
            
            this.recipes = [];
            this.index.search(ingredient, (results, errors) => {
                
                if(results.hits.length>1){
                    for (let id in results.hits) {
                     {
                        let result = (<any>Object).assign({id: results.hits[id].objectID, Name: results.hits[id].Name, Image: results.hits[id].Image});
                            this.ngZone.run(() => {
                                this.loader.hide();
                                this.recipes.push(result);
                            })                        
                        
                        }
                        
                    }
                }
                else{
                    this.loader.hide();
                    alert("sorry, I couldn't find any recipe with " + ingredient + "as an ingredient.")
                }
                    
                })           

        }
       
    }
