import { Component, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2'
import { AngularFireDatabase, AngularFireList, AngularFireObject } from '@angular/fire/compat/database';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import { BlogService } from '../services/blog.service';
import { Blog } from '../models/blog';
import tinymce from "tinymce";
import { StringLike } from '@firebase/util';
import { runInThisContext } from 'vm';
import { AuthenticationService } from "../services/auth.services";
import { ThrowStmt } from '@angular/compiler';
import { SolicitudesService } from '../services/solicitudes.service';

@Component({
    selector: 'app-view-Historial-admin',
    templateUrl: './verHistorial.component.html',
    styleUrls: ['verHistorial.component.css']
})

export class verHistorialComponent implements OnInit {
    recordsList: any;
    recordList = [];
    filteredRecordList = [];
    states = [
        'En espera',
        'Aprobada',
        'Denegada',
        'Falta más información',
    ];

    closeResult: string;
    fileList: any;

    constructor(private service: AuthenticationService, private recordService: SolicitudesService, private modalService: NgbModal) { }

    ngOnInit() {
        this.recordService.getSolicitudes(this.service.userDetails.uid).subscribe(records => {
            this.recordList = records.sort((a, b) => {
                let dateA = new Date(b.fecha), dateB = new Date(a.fecha)
                return +dateA - +dateB;
            });
            this.filteredRecordList = this.recordList;
        });
    }

    onSelectedChange(event:any){
        const state = event.target.value;
        if (state == "Todos") {
            this.filteredRecordList = this.recordList;
        } else {
            this.filteredRecordList = this.recordList.filter(record => {
                return record.estado == state;
            });
        }
    }

    open(content) {
        this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
          console.log(`Closed with: ${result}`);
        }, (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        });
      }

      private getDismissReason(reason: any): string {
        if (reason === ModalDismissReasons.ESC) {
          return 'by pressing ESC';
        } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
          return 'by clicking on a backdrop';
        } else {
          return `with: ${reason}`;
        }
      }
    
      onSelect(selectedItem: any){
        document.getElementById("nombre").setAttribute('value', selectedItem.nombrePaciente);
        document.getElementById("ciudad").setAttribute('value', selectedItem.ciudad);
        document.getElementById("estado").setAttribute('value', selectedItem.estado);
        document.getElementById("solicitud").setAttribute('value', selectedItem.queSolicita);
        document.getElementById("fecha").innerHTML = selectedItem.fecha;
        document.getElementById("hoja").setAttribute('href', selectedItem.hojaCompromiso);
        if(selectedItem.otros != '') document.getElementById("otros").setAttribute('href', selectedItem.otros);
        document.getElementById("estudio").setAttribute('href', selectedItem.estudioSE);
        document.getElementById("donacion").setAttribute('href', selectedItem.solicitudDonacion);
        (<HTMLInputElement>document.getElementById("descripcion")).value = selectedItem.descripcion;
        (<HTMLInputElement>document.getElementById("comentario")).value = selectedItem.comentario;
        (<HTMLInputElement>document.getElementById("comentarioP")).value = selectedItem.comentariosPresidencia;
        console.log(selectedItem);
        
      }

      onDragOver(event) {
        event.preventDefault();
      }
    
      // From drag and drop
      onDropSuccess(event) {
          event.preventDefault();
    
          this.onFileChange(event.dataTransfer.files);    // notice the "dataTransfer" used instead of "target"
      }
    
      // From attachment link
      onChangeFile(event) {
          this.onFileChange(event.target.files);    // "target" is correct here
      }

      getRequestPriority(priority){
        const priorities = [
          "Inmediata",
          "Alta",
          "Baja",
        ];

        return priorities[priority-1]
      }
    
      private onFileChange(files: File[]) {
        this.fileList = files;
      }
    
}
