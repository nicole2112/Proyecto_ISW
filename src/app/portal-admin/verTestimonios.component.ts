import { Component, OnInit } from "@angular/core";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
import { TestimonyService } from "../services/testimony.service";
import { ModalService } from '../services/modal.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2'
import { AngularFireDatabase } from "@angular/fire/compat/database";

@Component ({
    selector: 'app-view-testimonies-admin',
    templateUrl: './verTestimonios.component.html',
    styleUrls: ['verTestimonios.component.css']
})

export class VerTestimoniosComponent implements OnInit{
    testimonyList : any[];
    closeResult: any;
    urlList : string[];
    url;
    titulo;
    visible;
    prioridad;
    userSelectedId : string;
    estado="Disponible";
    opciones = ["Disponible", "Ocultar"];
    opcionesPrioridad =["Alta", "Media", "Baja"];
    Disponible = "Disponible";
    Ocultar = "Ocultar";

    NuevaLista: any[] = [];


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

    onSelectedChange3(event:any)
    {
        console.log(event.target.value);
        this.prioridad = event.target.value;
    }


    ShowTestimonies = false;
    toggleTestimoniesHandler(isShow: boolean){
      this.ShowTestimonies = true;
      console.log(this.ShowTestimonies);
    }

    ngOnInit(): void {
        this.testimService.getTestimonies().subscribe((item) => {
       
            this.testimonyList = item;
            this.titulo = item[0].titulo;
            //console.log(this.testimonyList);
            this.testimonyList.sort((a,b) => (a.prioridad > b.prioridad) ? 1 : ((b.prioridad > a.prioridad) ? -1 : 0));

            this.testimonyList.forEach(element => {

                if(element.visible == 1){
                    element.visible ="Disponible";
                }else{
                    element.visible ="Oculto";
                } 
                
                if(element.prioridad == 1){
                    element.prioridad ="Alta";
                }else if (element.prioridad == 2){
                    element.prioridad = "Media";
                }else if(element.prioridad == 3){
                    element.prioridad = "Baja"
                }
                this.NuevaLista.push(element);
            });

            console.log(this.NuevaLista);

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
        let prioridad;
        if(this.estado === "Disponible")
            visible = 1;
        else{
            visible = 0;
        }

        if(this.prioridad == "Alta"){
            prioridad = 1;
        }else if(this.prioridad == "Media"){
            prioridad = 2;
        }else if (this.prioridad == "Baja"){
            prioridad = 3;
        }
        
        this.testimonyList.forEach((item) =>
            {
                if(item.titulo === this.titulo)
                {
                item.visible = visible;
                item.prioridad = prioridad;
                console.log(prioridad);
                this.testimService.postTestimonies(item);
                }
            })

            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'Testimonio modificado!',
                showConfirmButton: false,
                timer: 1500
              });
            // this.testimService.editarTestomonio(this.titulo, visible);
        }
    }
}