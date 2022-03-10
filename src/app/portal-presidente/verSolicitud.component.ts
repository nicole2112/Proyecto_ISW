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
    selector: 'app-view-Solicitud-presidente',
    templateUrl: './verSolicitud.component.html',
    styleUrls: ['verSolicitud.component.css']
})

export class verSolicitudComponent implements OnInit {
    recordsList: any;
    recordList = [];
    filteredRecordList = [];
    states = [
      'En espera',
      'Aprobada',
      'Denegada',
      'Falta más información',
  ];
    state='En espera';
    descList: any[] = [];
    solicitudSelectedId: any;
    commentP;

    closeResult: string;
    fileList: any;

    constructor(private service: AuthenticationService, private recordService: SolicitudesService, private modalService: NgbModal) { }

    //Jose
    ngOnInit() {
      this.recordService.getTodasSolicitudes(this.service.userDetails.uid).subscribe(records => {
        this.recordList = records.sort((a, b) => {
            let dateA = new Date(b.fecha), dateB = new Date(a.fecha)
            return +dateA - +dateB;
        });
        this.filteredRecordList = this.recordList;
        this.recordList = this.filteredRecordList;
        this.filteredRecordList = [];

        this.recordList.forEach(item =>
          {
            this.pacService.getPaciente2(item['IDPaciente']).subscribe(pac => {
              pac['id'] = item['id'];
              item = {...pac, ...item};
              item['nombrePaciente'] = pac['nombre'];

              this.userService.getUser(item['digitador']).subscribe(usuario =>
                {
                  let userdata = {
                    "email": usuario['email'],
                    "nombreDigitador": usuario['nombre'],
                  };

                  item = {...item, ...userdata};
                  console.log(item);
                  this.filteredRecordList.push(item);
                });
            });
          });
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

    //Jose

    onSelectedStateChange(event:any)
    {
        this.state = event.target.value;
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
        this.solicitudSelectedId = selectedItem.key;
        document.getElementById("nombrePaciente").setAttribute('value', selectedItem.nombrePaciente);
        document.getElementById("ciudad").setAttribute('value', selectedItem.ciudad);
        document.getElementById("solicitud").setAttribute('value', selectedItem.queSolicita);
        (<HTMLInputElement>document.getElementById("descripcion")).value = selectedItem.descripcion;
        document.getElementById("hoja").setAttribute('href', selectedItem.hojaCompromiso);
        document.getElementById("otros").setAttribute('href', selectedItem.otros);
        document.getElementById("estudio").setAttribute('href', selectedItem.estudioSE);
        document.getElementById("donacion").setAttribute('href', selectedItem.solicitudDonacion);
        document.getElementById("image_preview").setAttribute('src', selectedItem.imagen1); //Pendiente
        if(selectedItem.image_preview2 != '')document.getElementById("image_preview2").setAttribute('src', selectedItem.imagen2); //Pendiente
      
      }

      editarSolicitud(id){
        this.commentP= (<HTMLInputElement>document.getElementById('comentarioP')).value;
        
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Solicitud Modificada!',
          showConfirmButton: false,
          timer: 1500
        })
        this.recordService.editarSolicitudPresidencia(id,this.state,this.commentP);
      }

      getSolicitudesXpaciente(){
        this.recordService.getALLSolicitudes().subscribe(data =>{
          this.solicitudesPacientesList =[];
          console.log(data);
          data.forEach(soli =>{
            let a = soli.payload.toJSON();
            a['key'] = soli.key;        
            if(a['IDPaciente'] == this.CedulaPaciente){
              this.solicitudesPacientesList = a;
            }else{
              this.callNotFoundFunction();
            }
          })
          this.filteredRecordList = this.solicitudesPacientesList;
        })
      }
    
}