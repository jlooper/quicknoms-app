import { Component, OnInit, NgZone, ViewChild, ElementRef } from "@angular/core";
import { Router } from "@angular/router";

import { AuthService, MLService } from "../services";

import * as camera from "nativescript-camera";
import { ImageAsset } from "image-asset";
import { ImageSource } from 'image-source';

import { LoadingIndicator } from "nativescript-loading-indicator";
import { Algolia } from "nativescript-algolia";

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
    
    constructor(private router: Router, 
        private ngZone: NgZone, 
        private mlService: MLService,
        ) 
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
            this.processItemPic(imageAsset);
        }).catch(err => {
            console.log(err.message);
        });
    
    }
    
    processItemPic(asset: ImageAsset) {
        const imageSource = new ImageSource();
        imageSource.fromAsset(asset)
        
        .then (image => {
            this.itemPic = image;
            //send to Google for analysis //png on ios
            const imageAsBase64 = image.toBase64String(enums.ImageFormat.png);
           
                this.loader.show({ message: 'Analyzing image...' });
            
                    this.mlService.queryGoogleVisionAPI(imageAsBase64)
                    .then(res => {
                        let result = res.content.toJSON();
                                this.ingredient = result.responses[0].labelAnnotations.map( mc => mc.description );                                                               
                                this.ngZone.run(() => {
                                    this.searchRecipes(this.ingredient)
                                })
                        });
                })               
        }

        searchRecipes(ingredient) {
            
            console.log("searching for..." + ingredient)
            this.loader.show({ message: 'Looking for recipes using ' + ingredient});
            
            this.recipes = [];
            this.index.search(ingredient.toString(), (results, errors) => {
                
                if(results && results.hits.length>1){
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
                    alert("sorry, I couldn't find any recipe with " + ingredient + " as an ingredient.")
                }
                    
           })           

        }

        goToRecipe(id: string){
            this.router.navigate(["/recipe", id]);
        }
       
    }
