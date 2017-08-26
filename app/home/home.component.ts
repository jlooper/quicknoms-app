import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import * as enums from "ui/enums";
import { Animation } from "ui/animation";
import { Router } from "@angular/router";
import { Observable } from "rxjs/Observable";
import { RecipesService } from "../services/recipes.service";

@Component({
    selector: "home",
    moduleId: module.id,
    templateUrl: "./home.component.html",
})
export class HomeComponent implements OnInit {
  
  public message$: Observable<any>;
  public _isFabOpen: boolean;
    
    @ViewChild("btna") btna: ElementRef;
    @ViewChild("btnb") btnb: ElementRef;
    @ViewChild("btnc") btnc: ElementRef;
    @ViewChild("fab") fab: ElementRef;

    constructor(private recipeService: RecipesService,
                private router: Router) 
                { }

    ngOnInit(): void {
        this.message$ = <any>this.recipeService.getMessage();

        
    }

    toggleNav(id){
        
      if (this._isFabOpen === true) {
            let animations = [
                  { target: this.fab.nativeElement, rotate: 0, duration: 280, delay: 0 },
                  { target: this.btna.nativeElement, translate: { x: 0, y: 0 }, opacity: 0, duration: 280, curve: enums.AnimationCurve.easeOut, delay: 0 },
                  { target: this.btnb.nativeElement, translate: { x: 0, y: 0 }, opacity: 0, duration: 280, curve: enums.AnimationCurve.easeOut, delay: 0 },
                  { target: this.btnc.nativeElement, translate: { x: 0, y: 0 }, opacity: 0, duration: 280, curve: enums.AnimationCurve.easeOut, delay: 0 },
        ];

              var a = new Animation(animations);

              a.play()
                  .then(() => {
                      if(id !== "Home"){
                        this.router.navigate([id])
                      }
                      this._isFabOpen = false;
                  })
                  .catch(function (e) {
                      console.log(e.message);
                  });
        }
        else {
            console.log(this.fab.nativeElement)
          let animations = [
                  { target: this.fab.nativeElement, rotate: 45, duration: 280, delay: 0 },
                  { target: this.btna.nativeElement, translate: { x: 0, y: 50 }, opacity: 1, duration: 280, curve: enums.AnimationCurve.easeOut, delay: 0 },
                  { target: this.btnb.nativeElement, translate: { x: 0, y: 100 }, opacity: 1, duration: 280, curve: enums.AnimationCurve.easeOut, delay: 0 },
                  { target: this.btnc.nativeElement, translate: { x: 0, y: 150 }, opacity: 1, duration: 280, curve: enums.AnimationCurve.easeOut, delay: 0 },
              ];

              let a = new Animation(animations);

              a.play()
                  .then(() => {
                      this._isFabOpen = true;
                  })
                  .catch(function (e) {
                      console.log(e.message);
                  });
        }
    }

    goToCategory(category: string){
        this.router.navigate(["/recipes", category]);
    }

    goToSearch(){
        this.router.navigate(["/search"]);
    }

    

    
}
