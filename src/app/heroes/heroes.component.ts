import { Component } from "@angular/core";

@Component({
    selector: 'heroes',
    templateUrl: './heroes.component.html'
})

export class HeroesComponent{
    heroes: Heroe[] =[  
        {
            nombre:'Jeff',
            foto:'https://media.istockphoto.com/photos/cute-boy-outdoors-picture-id1193994027?k=20&m=1193994027&s=612x612&w=0&h=Tym-uedS02jzDcDxPtBo9HSGV4JnCQlQ4y9We3oRr0c=',
            contenido:'Niño de 12',
            estado:'Vivo'
        },
        {
            nombre:'Jason',
            foto:'https://www.conmishijos.com/uploads/bebes/conduca-2-anos-art.jpg',
            contenido:'Niño de 14',
            estado:'Vivo'
        },
        {
            nombre:'Jolyne',
            foto:'https://i1.wp.com/quenoticias.com/wp-content/uploads/2020/10/nina-del-pastel.jpg?fit=1200%2C680&ssl=1',
            contenido:'Niña de 15',
            estado:'Fallecida'
        },
    ]  
}

class Heroe {
    nombre : string;  
    foto : string;
    contenido : string;
    estado : string;
} 