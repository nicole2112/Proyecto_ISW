import { Component, OnInit } from "@angular/core";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
import { TestimonyService } from "../services/testimony.service";
import { ModalService } from '../services/modal.service';
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";

@Component ({
    selector: 'verTestimonios',
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
            console.log(this.testimonyList);

        });

    }

    inputVideo(url:string):SafeResourceUrl{
        console.log(this._sanitizer.bypassSecurityTrustResourceUrl(url));
        return this._sanitizer.bypassSecurityTrustResourceUrl(url);
      }

      modificarTestimonio()
      {
          if(this.titulo !== null && this.estado !== null)
          {
              let testimonio={
              "titulo" : "",
              "visible" : 0,
              };
              let visible;
              if(this.estado === "Disponible")
                  visible = 1;
              else
                  visible = 0;
              testimonio = {
              "titulo" : this.titulo,
              "visible" : visible,
              }
              
              console.log(testimonio.titulo);
              console.log(testimonio.visible);
              this.testimService.editarTestomonio(testimonio.titulo,testimonio.visible);
          }
      }
}