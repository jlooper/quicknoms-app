import { Component, ChangeDetectionStrategy, OnInit, NgZone} from "@angular/core";
import { ActivatedRoute } from "@angular/router";
//import { RecipeModel } from "../models/recipes";
import { RecipesService } from "../services/recipes.service";
import { SegmentedBarItem } from "ui/segmented-bar";
import { TNSTextToSpeech, SpeakOptions } from 'nativescript-texttospeech';
import { TNSFontIconService } from 'nativescript-ngx-fonticon';

@Component({
    selector: "recipe-detail",
    moduleId: module.id,
    templateUrl: "./recipe-detail.component.html"
})
export class RecipeDetailComponent implements OnInit {
    //recipe: RecipeModel;
    private sub: any;
    id: string;
    term: string;
    isSpeaking: boolean = false;
    isHighlighted: boolean = false;
    visibility: string;
    name: string;
    notes: string;
    image: string;
    method: string;
    tools: string;
    ingredients: string;
    recipeSteps: Array<any>;
    public procedure: string;
    private TTS: TNSTextToSpeech;
    private content: string;
    public query: string;

    constructor(
        private recipeService: RecipesService,
        private route: ActivatedRoute,
        private ngZone: NgZone,
        private fonticon: TNSFontIconService
    ) {
        //this.recipeSteps = [{title: 'Ingredients'}, { title: 'Tools' }, { title: 'Procedure' }];
        let firstItem = new SegmentedBarItem();
        let secondItem = new SegmentedBarItem();
        let thirdItem = new SegmentedBarItem();
        firstItem.title = "Ingredients";
        secondItem.title = "Tools";
        thirdItem.title = "Procedure";
        this.recipeSteps = [ firstItem, secondItem, thirdItem ];
        this.TTS = new TNSTextToSpeech();
    }

    ngOnInit() {
        this.sub = this.route.params.subscribe((params: any) => {
            this.id = params['id'];
            this.term = params['term'];
            this.recipeService.getRecipe(this.id).subscribe((recipe) => {
                this.ngZone.run(() => {
                for (let prop in recipe) {
                    //props
                    if (prop === "id") {
                        this.id = recipe[prop];
                    }
                    if (prop === "Name") {
                        this.name = recipe[prop];
                    }
                    if (prop === "Notes") {
                        this.notes = recipe[prop];
                    }
                    if (prop === "Image") {
                        this.image = recipe[prop];
                    }
                    if (prop === "Tools") {
                        this.tools = recipe[prop];
                    }
                    if (prop === "Method") {
                        this.method = recipe[prop];
                    }
                    if (prop === "Ingredients") {
                        this.ingredients = recipe[prop];
                    }                       
                 }
                this.procedure = this.ingredients;
                });
            });
        });  
    }

   /*public highlight() {
        if(!this.query) {
            return this.content;
        }
        return this.content.replace(new RegExp(this.query, 'egg'), match => {
            return 'yellow';
        });
    }*/

    changeTab(id: number){

         switch (id) {
            case 0:
                this.procedure = this.ingredients; 
                break;
            case 1:
                this.procedure = this.tools; 
                break;
            case 2:
                this.procedure = this.method; 
                break;            
         }

    }

    
    speak(text: string){
        this.isSpeaking = true;
        let speakOptions: SpeakOptions = {
            text: text,
            speakRate: 0.5,
            finishedCallback: (() => {
                this.isSpeaking = false;
            })   
        }
		this.TTS.speak(speakOptions);
    }

}

