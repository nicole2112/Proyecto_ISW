import { Component, OnInit } from "@angular/core";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
import { TestimonyService } from "../services/testimony.service";
import { ModalService } from '../services/modal.service';
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import Swal from 'sweetalert2'

@Component ({
    selector: 'app-view-testimonies-admin',
    templateUrl: './verTestimonios.component.html',
    styleUrls: ['verTestimonios.component.css']
})

export class VerTestimoniosComponent implements OnInit{
    testimonyList : any[];
    urlList : string[];
    url;
    titulo;
    visible;
    userSelectedId : string;
    estado="Disponible";
    opciones = ["Disponible", "Ocultar"];
    Disponible = "Disponible";
    Ocultar = "Ocultar";

    constructor(private testimService: TestimonyService, private _sanitizer: DomSanitizer,private modalService: NgbModal)
    {

    }

    onSelectedChange(event:any)
    {
        
        console.log(event.target.value);
        this.estado = event.target.value;
    }

    onSelectedChange2(event:any)
    {
        console.log(event.target.value);
        this.titulo = event.target.value;
    }


    ShowTestimonies = false;
    toggleTestimoniesHandler(isShow: boolean){
      this.ShowTestimonies = true;
      console.log(this.ShowTestimonies);
    }

    ngOnInit(): void {
        //console.log(this.testimService.getTestimonies());
        this.testimService.getTestimonies().subscribe((item) => {
            //console.log(item);
            // let nuevo = item;
            // nuevo.forEach(element => {
            //     element.video_url = this.inputVideo(element.video_url);
            // });
            this.testimonyList = item;
            this.titulo = item[0].titulo;
            this.visible = item[0].visible;
            console.log(this.testimonyList);

        });

    }
    
    inputVideo(url:string):SafeResourceUrl{
        return this._sanitizer.bypassSecurityTrustResourceUrl(url);
      }

    modificarTestimonio()
    {
        if(this.titulo !== null && this.estado !== null)
        {
        let visible;
        if(this.estado === "Disponible")
            visible = 1;
        else
            visible = 0;
        
        this.testimonyList.forEach((item) =>
            {
                if(item.titulo === this.titulo)
                {
                item.visible = visible;
                this.testimService.postTestimonies(item);
                }
            })

            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'Testimonio modificado!',
                showConfirmButton: false,
                timer: 1500
              })
            
            // this.testimService.editarTestomonio(this.titulo, visible);
        }
    }
}