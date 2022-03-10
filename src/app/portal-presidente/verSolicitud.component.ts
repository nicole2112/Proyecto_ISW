import { Component, OnInit } from '@angular/core';
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
import { map, take, takeWhile } from 'rxjs/operators';
import { combineLatest, forkJoin, Observable } from 'rxjs';

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

    solicitudesPacientesList :any[] =[];
    listSoliPacienteFiltered :any[]=[];
    CedulaPaciente: any;
    emailDigi:any;
    patientName:any;

    constructor(private service: AuthenticationService, private recordService: SolicitudesService,private pacService: PacientesService, private userService: RetrieveUsersService, private modalService: NgbModal) { }

    //Jose
    ngOnInit() {
      
      this.recordService.getTodasSolicitudes(this.service.userDetails.uid).subscribe( records => {
        let listanueva;
        listanueva = records.sort((a, b) => {
              let dateA = new Date(b.fecha), dateB = new Date(a.fecha)
              return +dateA - +dateB;
          });
          let observables: Observable<any>[] = [];
          let observables2: Observable<any>[] = [];

          listanueva.forEach( item =>
          {
            observables.push(this.pacService.getPaciente2(item['IDPaciente']))
          });

          let nuevalista:any = [];
          combineLatest(observables).pipe(map(pac =>
          {

            let item2;
            listanueva.forEach( (item, index) =>
            {
              pac[index]['id'] = item['id'];
              item2 = {...pac[index], ...item};
              item2['nombrePaciente'] = pac[index]['nombre'];
              nuevalista.push(item2);
            });

            nuevalista.forEach( objeto =>
              {
                observables2.push(this.userService.getUser(objeto['digitador']));
                this.userService.getUser(objeto['digitador']).pipe(take(1)).subscribe(usuario =>
                  {
                    let item3;
                    let userdata = {
                      "email": usuario['email'],
                      "nombreDigitador": usuario['nombre'],
                    };
                    item3 = {...objeto, ...userdata};
                    if(!this.filteredRecordList.includes(item3))
                  {
                    this.filteredRecordList.push(item3);
                    this.recordList.push(item3);
                  }
                });
            });

          }), takeWhile(() => true)).subscribe(data => {this.filteredRecordList = [...new Set(this.filteredRecordList)];
            this.recordList = [...new Set(this.recordList)];});
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
        document.getElementById("nombreDigitador").setAttribute('value', selectedItem.nombreDigitador);
        document.getElementById("email").setAttribute('value', selectedItem.email);
        this.patientName=document.getElementById("nombrePaciente").setAttribute('value', selectedItem.nombrePaciente);
        document.getElementById("ciudad").setAttribute('value', selectedItem.ciudad);
        document.getElementById("solicitud").setAttribute('value', selectedItem.queSolicita);
        (<HTMLInputElement>document.getElementById("descripcion")).value = selectedItem.descripcion;
        if(selectedItem.hojaCompromiso != '' || selectedItem.hojaCompromiso != '/')document.getElementById("hoja").setAttribute('href', selectedItem.hojaCompromiso);
        if(selectedItem.otros != '' || selectedItem.otros != '/')document.getElementById("otros").setAttribute('href', selectedItem.otros);
        document.getElementById("estudio").setAttribute('href', selectedItem.estudioSE);
        document.getElementById("donacion").setAttribute('href', selectedItem.solicitudDonacion);
        document.getElementById("image_preview").setAttribute('src', selectedItem.imgCasa1); 
        if(selectedItem.image_preview2 != '')document.getElementById("image_preview2").setAttribute('src', selectedItem.imgCasa2);
        
      }

      editarSolicitud(id){
        this.commentP= (<HTMLInputElement>document.getElementById('comentarioP')).value;
        this.patientName=(<HTMLInputElement>document.getElementById('nombrePaciente')).value;
        this.emailDigi= (<HTMLInputElement>document.getElementById('email')).value;
        
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Solicitud Modificada!',
          showConfirmButton: false,
          timer: 1500
        })
        this.recordService.editarSolicitudPresidencia(id,this.state,this.commentP);
        EnviarCorreoDigi(this.patientName,this.emailDigi);
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