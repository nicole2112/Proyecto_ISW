import { Component } from "@angular/core";

@Component({
    selector: 'app-add-articulo-admin',
    templateUrl: './agregarArticulo.component.html',
    styleUrls: ['./agregarArticulo.component.css']
})

export class AgregarArticuloComponent{
    
    titulo: any;
    descripcion: any;
    fecha: any;
    contenido: any;
    public categorias = null;

    public val = null;

    config = {
        labelField: 'label',
        valueField: 'value',
        maxItems: 10,
        highlight: true,
        create: false,
    };
    
    data = [
        {
            label: 'Medicina',
            value: 'Medicina'
        },
            {
            label: 'Eventos',
            value: 'Eventos'
        },
            {
            label: 'Donaciones',
            value: 'Donaciones'
        }
    ]

    ngOnInit(){

    }

    public changed() {
        console.log(this.categorias);
    }

    agregarCategoria()
    {
        const item = {
            label: "Pediatria",
            value: "Pediatria"
        };

        this.data.push(item);
    }
}