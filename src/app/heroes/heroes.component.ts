import { Component, OnInit } from "@angular/core";
import { AuthenticationService } from "../services/auth.services";

@Component({
    selector: 'heroes',
    templateUrl: './heroes.component.html'
})

export class HeroesComponent implements OnInit{
    nombre:any;
    foto: any;
    contenido:any;
    estado: any;
    
    prioridad:any;
    visibilidad:any;

    heroesList:any[];

    constructor(private service: AuthenticationService){}
    
    ngOnInit(){
        this.service.db.list('heroes').valueChanges().subscribe(heroes => {
            console.log(heroes);
            this.heroesList = heroes;
          });
    }

}


