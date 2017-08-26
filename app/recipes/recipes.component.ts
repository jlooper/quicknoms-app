import { Component, OnInit } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { RecipesService } from "../services/recipes.service";
import { Router, ActivatedRoute } from "@angular/router";

@Component({
    selector: "recipes",
    moduleId: module.id,
    templateUrl: "./recipes.component.html",
})
export class RecipesComponent implements OnInit {
  
  public recipes$: Observable<any>;
  private sub: any;
  category: string;
  title: string;
  
    constructor(private recipeService: RecipesService,
                private activatedRoute: ActivatedRoute,
                private router: Router) 
                { }

    ngOnInit(): void {
        this.sub = this.activatedRoute.params.subscribe((params: any) => {
            this.category = params['category'];
                this.recipes$ = <any>this.recipeService.getRecipes(this.category);
                //title
                switch (this.category)
                {
                case "meat":
                    this.title = "Meat Recipes";
                    break;
                case "soupssalads":
                    this.title = "Soup and Salad Recipes";
                    break;
                case "snacks":
                    this.title = "Snack Recipes";
                    break;
                case "desserts":
                    this.title = "Dessert Recipes";
                    break;
                case "vegetarian":
                    this.title = "Vegetarian Recipes";
                    break;
                case "everythingelse":
                    this.title = "Everything Else";
                    break;
                case "all":
                    this.title = "All Recipes";
                    break;
                default : "Recipes";
                }
        })
    }

    goToRecipe(id: string){
        this.router.navigate(["/recipe", id]);
    }
}
