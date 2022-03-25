import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2'
import { AngularFireDatabase, AngularFireList, AngularFireObject } from '@angular/fire/compat/database';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import { BlogService } from '../services/blog.service';
import { Blog } from '../models/blog';
import { StringLike } from '@firebase/util';
import { runInThisContext } from 'vm';
import { AuthenticationService } from "../services/auth.services";
import { ThrowStmt } from '@angular/compiler';
import { SolicitudesService } from '../services/solicitudes.service';
import { PacientesService } from '../services/pacientes.service';
import { RetrieveUsersService } from '../services/retrieve-users.service';
import { EnviarCorreoDigi } from '../services/email.service';
import { distinct, map, take, takeUntil, takeWhile } from 'rxjs/operators';
import { combineLatest, forkJoin, Observable, Subject } from 'rxjs';

@Component({
    selector: 'app-view-Solicitud-presidente',
    templateUrl: './verSolicitud.component.html',
    styleUrls: ['verSolicitud.component.css']
})

export class verSolicitudComponent implements OnInit, OnDestroy  {
  private ngUnsubscribe = new Subject();
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
    solicitudPacienteSelectedId: any;
    solicitudPreEdicion: any;
    commentP;
    estado: any;

    closeResult: string;
    fileList: any;
    type: any = 0;
    show: boolean = true;

    solicitudesPacientesList :any[] =[];
    listSoliPacienteFiltered :any[]=[];
    CedulaPaciente: any;
    emailDigi:any;
    patientName:any;
    sub:any;
    sub2:any = new Subject();

    constructor(private service: AuthenticationService, private recordService: SolicitudesService,private pacService: PacientesService, private userService: RetrieveUsersService, private modalService: NgbModal) { }

    //Jose
    ngOnInit() {
      this.filteredRecordList = [];
      this.recordList = [];
      let listanueva = [];
      this.sub2 = this.recordService.getTodasSolicitudes(this.service.userDetails.uid).subscribe( records => {
        listanueva = [];
        
        records.sort((a, b) => {
          if (a.prioridad === b.prioridad) {
            let dateA = new Date(b.fecha), dateB = new Date(a.fecha);
            return +dateA - +dateB;
          } else {
            return a.prioridad < b.prioridad ? -1 : 1;
          }
        });
        
        this.sub = this.userService.getDigitadores().pipe(take(1)).subscribe(digitadores =>
        {
          while(this.filteredRecordList.length > 0) {
            this.filteredRecordList.pop();
          }
          while(this.recordList.length > 0) {
            this.recordList.pop();
          }
          
          records.forEach(item => 
            {
              digitadores.forEach( usuario =>
              {
                if(usuario['digitadorKey'] == item['digitador'])
                {
                  let userdata = {
                    "email": usuario['email'],
                    "nombreDigitador": usuario['nombre'],
                  };
    
                  item = {...item, ...userdata};
                }
              })

              this.recordList.push(item);
              //if(item.archivado == 0)
                this.filteredRecordList.push(item);
            });
            
        });
        
      });
    }

    ngOnDestroy() {
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
        //if(selectedItem.estado == 'En Espera') this.type = 1; this.show = false;
        this.solicitudSelectedId = selectedItem.solicitudKey;
        this.solicitudPacienteSelectedId = selectedItem.pacienteKey;
        this.solicitudPreEdicion = selectedItem.rawSolicitud;
        document.getElementById("estado").setAttribute('value', selectedItem.estado);
        document.getElementById("nombreDigitador").setAttribute('value', selectedItem.nombreDigitador);
        document.getElementById("email").setAttribute('value', selectedItem.email);
        this.patientName=document.getElementById("nombrePaciente").setAttribute('value', selectedItem.nombrePaciente);
        document.getElementById("ciudad").setAttribute('value', selectedItem.ciudad);
        document.getElementById("solicitud").setAttribute('value', selectedItem.queSolicita);
        (<HTMLInputElement>document.getElementById("descripcion")).value = selectedItem.descripcion;
        if(selectedItem.hojaCompromiso != '')document.getElementById("hoja").setAttribute('href', selectedItem.hojaComp);
        if(selectedItem.otros != '') document.getElementById("otros").setAttribute('href', selectedItem.otros);
        if(selectedItem.estudioSE != '') document.getElementById("estudio").setAttribute('href', selectedItem.estudioSE);
        if(selectedItem.solicitudDonacion != '') document.getElementById("donacion").setAttribute('href', selectedItem.solicitudDonacion);
        document.getElementById("image_preview").setAttribute('src', selectedItem.imgCasa1); 
        if(selectedItem.image_preview2 != '')document.getElementById("image_preview2").setAttribute('src', selectedItem.imgCasa2);
        
      }

      editarSolicitud(idPaciente, idSolicitud, solicitudPreEditar){
        this.commentP= (<HTMLInputElement>document.getElementById('comentarioP')).value;
        this.patientName=(<HTMLInputElement>document.getElementById('nombrePaciente')).value;
        this.emailDigi= (<HTMLInputElement>document.getElementById('email')).value;
        (document.getElementById("Todos") as any).selected = "true";

        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Solicitud Modificada!',
          showConfirmButton: false,
          timer: 1500
        })
        EnviarCorreoDigi(this.patientName,this.emailDigi);
        this.recordService.editarSolicitudPresidencia(idPaciente, idSolicitud, solicitudPreEditar,this.state,this.commentP);
        
      }

      callNotFoundFunction(){
        Swal.fire({
          position: 'top-end',
          icon: 'error',
          title: '¡Paciente no encontrado!',
          showConfirmButton: false,
          timer: 1500,
        });
      }
}