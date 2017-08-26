import { Component, NgZone, OnInit } from "@angular/core";
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { Router, ActivatedRoute } from "@angular/router";
import { Algolia } from "nativescript-algolia";
import { LoadingIndicator } from "nativescript-loading-indicator";
import { AuthService } from "../services/auth.service";

@Component({
    selector: "recipesearch",
    moduleId: module.id,
    templateUrl: "./recipe-search.component.html",
})
export class RecipeSearchComponent implements OnInit {

    recipes: Array<any> = [];
    term: string;
    ingredient: string;
    
    constructor(private router: Router, private ngZone: NgZone, private activatedRoute: ActivatedRoute) {}
    loader = new LoadingIndicator();
    client = new Algolia(AuthService.algoliaAppId, AuthService.algoliaKey);
    index = this.client.initIndex("recipes");

    search(e: any) {
        this.loader.show({ message: 'Finding recipes...' });
        //clear
        this.recipes = [];
        this.term = "";
        if (e && e.object) {
            this.term = e.object.text;
            this.index.search(this.term, (results, errors) => {
                if(results.hits.length>1){
                    for (let id in results.hits) {
                        let result = (<any>Object).assign({id: results.hits[id].objectID, Name: results.hits[id].Name, Image: results.hits[id].Image});
                            this.ngZone.run(() => {
                                this.recipes.push(result);
                            })                        
                        this.loader.hide();
                        }
                }
                else {
                    this.loader.hide();
                    alert("none!")
                }
            })
            
            
            }
            else {
                alert("Sorry, no recipes found!");
                this.loader.hide();
            }
            
    }

    
    ngOnInit(){
        //this.ingredient = this.activatedRoute.snapshot.queryParams['ingredient']
    }
    
    goToRecipe(id: string){
        let navigationExtras = {
            queryParams: { 'term': this.term }
        }
        this.router.navigate(["/recipe", id], navigationExtras);
    }
}
 