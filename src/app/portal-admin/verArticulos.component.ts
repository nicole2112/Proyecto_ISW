import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
import { TestimonyService } from "../services/testimony.service";
import { ModalService } from '../services/modal.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2'
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import { ignoreElements, take } from 'rxjs/operators';
import { AuthenticationService } from '../services/auth.services';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from '@angular/fire/compat/database';
//import { Heroe } from '../models/heroe';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { empty } from 'rxjs';

@Component ({
    selector: 'app-view-articulos-admin',
    templateUrl: './verArticulos.component.html',
    styleUrls: ['verArticulos.component.css']
})


export class verArticulosComponent {
    articuloList;
}
/*
export class verArticulosComponent implements OnInit{
}

ngOnInit(): void {
    this.testimService.getTestimonies().subscribe((item) => {
   
      this.testimonyList = item;
      this.titulo = item[0].titulo;
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

      //this.testimonyList = item;
  });
}
*/