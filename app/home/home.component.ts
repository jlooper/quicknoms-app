import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, ChangeDetectorRef } from "@angular/core";
import * as enums from "ui/enums";
import { Animation } from "ui/animation";
import { Router } from "@angular/router";
import { Observable } from "rxjs/Observable";
import { RecipesService } from "../services/recipes.service";
import { Page } from "ui/page";
import { RadSideDrawerComponent, SideDrawerType } from "nativescript-pro-ui/sidedrawer/angular";
import { RadSideDrawer } from 'nativescript-pro-ui/sidedrawer';

@Component({
    selector: "home",
    moduleId: module.id,
    templateUrl: "./home.component.html",
})
export class HomeComponent implements AfterViewInit, OnInit {
  
  public message$: Observable<any>;


    @ViewChild(RadSideDrawerComponent) public drawerComponent: RadSideDrawerComponent;
    private drawer: RadSideDrawer;
    
    constructor(private recipeService: RecipesService,
                private router: Router,
                private _changeDetectionRef: ChangeDetectorRef) 
                { }

    

    ngAfterViewInit() {
        this.drawer = this.drawerComponent.sideDrawer;
        this._changeDetectionRef.detectChanges();
    }
    
    ngOnInit(): void {
        this.message$ = <any>this.recipeService.getMessage();
    }


    public openDrawer() {
        this.drawer.showDrawer();
    }

    public onCloseDrawerTap() {
       this.drawer.closeDrawer();
    }

    goToCategory(category: string){
        this.router.navigate(["/recipes", category]);
    }

    goToSearch(){
        this.router.navigate(["/search"]);
    }

    navigate(route: string){
        console.log(route)
        this.router.navigate(["/"+route]);
    }

    

    
}
