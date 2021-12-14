import { Component } from "@angular/core";
import { TestimonyService } from "../services/testimony.service";
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2'
import { Router } from "@angular/router";

@Component ({
    selector: 'app-add-testimonies-admin',
    templateUrl: './agregarTestimonios.component.html',
    styleUrls: ['agregarTestimonio.component.css']
})

export class AgregarTestimoniosComponent {

    titulo;
    url;
    name;
    estado="Disponible";
    opciones = ["Disponible", "Ocultar"];
    Disponible = "Disponible";
    Ocultar = "Ocultar";
    prioridad = "Alta";
    opcionesPrioridad = ["Alta","Media", "Baja"];

    constructor(private tService: TestimonyService,private router: Router)
    {

    }

    onSelectedChange(event:any)
    {
        this.estado = event.target.value;
    }

    onSelectedPriorityChange(event:any)
    {
        this.prioridad = event.target.value;
        console.log(this.prioridad);
    }

    validarURL(link)
    {
        return /<(“[^”]*”|'[^’]*’|[^'”>])*>/.test(link);
    }

    agregarTestimonio()
    {
        const type = (<HTMLInputElement>document.getElementById('url')).value;
        let nuevo = type.substr(13, 162);
        
        if(this.titulo !== null && this.url !== null && this.estado !== null)
        {
            let testimonio = {};
            let visible;
            if(this.estado === "Disponible")
                visible = 1;
            else
                visible = 0;

            let numPrioridad = 3;
            switch(this.prioridad)
            {
                case "Alta":
                    numPrioridad = 1;
                    break;
                case "Media":
                    numPrioridad = 2;
                    break;
                case "Baja":
                default: 
                    numPrioridad = 3;
            }

            testimonio = {
                "titulo" : this.titulo,
                "video_url" : nuevo,
                "visible" : visible,
                "prioridad": numPrioridad,
            }

            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'Testimonio agregado!!',
                showConfirmButton: false,
                timer: 1500
              })

            this.tService.postTestimonies(testimonio);
        }
    }

}