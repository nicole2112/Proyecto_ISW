import { Component } from "@angular/core";
import { TestimonyService } from "../services/testimony.service";

@Component ({
    selector: 'agregarTestimonios',
    templateUrl: './agregarTestimonios.component.html',
    styleUrls: ['agregarTestimonio.component.css']
})

export class AgregarTestimoniosComponent {

    titulo;
    url;
    estado="Disponible";
    opciones = ["Disponible", "Ocultar"];
    Disponible = "Disponible";
    Ocultar = "Ocultar";

    constructor(private tService: TestimonyService)
    {

    }

    onSelectedChange(event:any)
    {
        console.log(event.target.value);
        this.estado = event.target.value;
    }

    agregarTestimonio()
    {
        if(this.titulo !== null && this.url !== null && this.estado !== null)
        {
            let testimonio = {};
            let visible;
            if(this.estado === "Disponible")
                visible = 1;
            else
                visible = 0;
            testimonio = {
            "titulo" : this.titulo,
            "video_url" : this.url,
            "visible" : visible,
            }

            this.tService.postTestimonies(testimonio);
        }
    }

}