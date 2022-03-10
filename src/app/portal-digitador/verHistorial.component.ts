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
import { PacientesService } from '../services/pacientes.service';
import { RetrieveUsersService } from '../services/retrieve-users.service';

@Component({
    selector: 'app-view-Historial-admin',
    templateUrl: './verHistorial.component.html',
    styleUrls: ['verHistorial.component.css']
})

export class verHistorialComponent implements OnInit {
    recordsList: any;
    recordList = [];
    pacientesList = [];
    filteredRecordList = [];
    states = [
        'En espera',
        'Aprobada',
        'Denegada',
        'Falta más información',
    ];

    closeResult: string;
    IDPaciente: any="";
    prioridad: any=3;
    archivado: any=0;
    solicitud: any="";
    estado: any="";
    descripcion: any="";
    socioeconomico: any="";
    solDonacion: any="";
    otros:any="";
    fileList: any[] = [];
    urlList: any[] = [];
    descList: any[] = [];
    namePattern = '^[a-zA-Z ]*$';

    //Variables para obtener solicitudes por paciente

    solicitudesRef: AngularFireList<any>;
    
    solicitudesPacientesList :any[] =[];
    listSoliPacienteFiltered :any[]=[];
    CedulaPaciente: any;

    filtro=[
      'Aprobada',
      'Denegada'
    ];

    

    constructor(private service: AuthenticationService, private recordService: SolicitudesService, private pacService: PacientesService, private userService: RetrieveUsersService, private modalService: NgbModal) { }

    async ngOnInit() {

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
                    //console.log(item);
                    this.filteredRecordList.push(item);
                  });
              });
            });
      });
    }

    
    getSolicitudesXpaciente(){
      this.solicitudesRef =this.service.db.list('solicitudes');
      this.solicitudesRef.snapshotChanges().subscribe(data =>{
        this.solicitudesPacientesList =[];
        data.forEach((soli) =>{
          console.log(soli);
          let a = soli.payload.toJSON();
          a['key'] = soli.key;        
          if(a['IDPaciente'] == this.CedulaPaciente){
            this.solicitudesPacientesList.push(a);
          }
        })
        this.listSoliPacienteFiltered = this.solicitudesPacientesList;
      })
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

    onSelectedChangeBuscarPaciente(event: any){
      const filter = event.target.value;
      if(filter == "Todos"){
        this.listSoliPacienteFiltered = this.solicitudesPacientesList;
      }else{
        this.listSoliPacienteFiltered = this.solicitudesPacientesList.filter(record =>{
          return record.estado == filter;
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
    
          this.onFileChange(event.dataTransfer.files, event.target.name);    // notice the "dataTransfer" used instead of "target"
      }
    
      // From attachment link
      onChangeFile(event) {
          this.onFileChange(event.target.files, event.target.name);    // "target" is correct here
      }
    
      private onFileChange(files: File[], descArchivo) {
        this.fileList.push(files[0]);
        this.descList.push(descArchivo);
      }

      editarSolicitud(id){
        
        Promise.all(this.fileList.map( async (file) =>
        {
            return this.guardarArchivo(file);
        })).then((message) =>
        {
          this.descList.forEach((item, index, array) =>
          {
              switch(item)
              {
                case "socioeconomico":
                    this.socioeconomico = message[index];
                    break;
                case "solDonacion":
                    this.solDonacion = message[index];
                    break;
                case "otros":
                    this.otros = message[index];
                    break;
              }
          });
          this.recordService.editarSolicitud(id, this.descripcion, this.estado, this.archivado, this.prioridad, this.solicitud, this.socioeconomico, this.solDonacion, this.otros);
        });
    }

    async guardarArchivo(nuevoArchivo){
      return new Promise(async (resolve, reject) =>
      {
          let filename = nuevoArchivo.name;
      
          const storage = getStorage();
          const storageRef = ref(storage, filename);
      
          uploadBytes(storageRef, nuevoArchivo).then((snapshot) => {
          
          
          }).then(
          ()=>{
              getDownloadURL(storageRef).then(data =>{
              resolve(data);
              }).catch((error)=>{
                  reject(error);
              });
          }
          );
      })
    }
}
