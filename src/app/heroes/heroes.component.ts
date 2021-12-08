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

    heroesList:any[]=[];

    constructor(private service: AuthenticationService){}
    
    ngOnInit(){
        this.service.db.list('heroes').valueChanges().subscribe(heroes => {
            this.heroesList = heroes;
            this.heroesList.sort((a,b) => (a.prioridad > b.prioridad) ? 1 : ((b.prioridad > a.prioridad) ? -1 : 0));
            console.log(this.heroesList);
          });

    }

}