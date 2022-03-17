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
import { RetrievePatientService } from '../services/retrieve-pacient.service';
import { PacientesService } from '../services/pacientes.service';
import { RetrieveUsersService } from '../services/retrieve-users.service';
import { combineLatest, forkJoin, Observable } from 'rxjs';
import { map, take, takeWhile } from 'rxjs/operators';
import { faBox, faBoxOpen } from '@fortawesome/free-solid-svg-icons';
import { faLeaf } from '@fortawesome/free-solid-svg-icons';

import '../../assets/js/smtp.js';
declare const Email: any;

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
    showArchived = false;
    actualState = 'Todos';

    faBox = faBox;
    faBoxOpen = faBoxOpen;

    closeResult: string;
    IDPaciente: any="";
    prioridad: any=3;
    prioridadEmail: any="";
    archivado: any=0;
    solicitud: any="";
    estado: any="";
    descripcion: any="";
    hoja: any="";
    socioeconomico: any="";
    solDonacion: any="";
    otros:any="";
    fileList: any[] = [];
    urlList: any[] = [];
    descList: any[] = [];
    namePattern = '^[a-zA-Z ]*$';

    solicitudPreEdicion: any;
    solicitudSelectedId: any;
    solicitudSelectedName: any;
    pacienteSelectedId: any;
    pacienteSelectedKey: any;

    nombre: any;
    ciudad: any;
    prioridadString: any;

    digitadorMod: any="";
    nombrePaciente: any="";

    constructor(private service: AuthenticationService, private recordService: SolicitudesService, private pacService: PacientesService, private patientService: RetrievePatientService, private userService: RetrieveUsersService, private modalService: NgbModal) { }

    ngOnInit() {

      this.recordService.getTodasSolicitudes(this.service.userDetails.uid).subscribe( records => {
        let listanueva;
        this.filteredRecordList = [];
        this.recordList = [];

        listanueva = records.sort((a, b) => {
            if (a.prioridad === b.prioridad) {
              let dateA = new Date(b.fecha), dateB = new Date(a.fecha);
              return +dateA - +dateB;
            } else {
              return a.prioridad < b.prioridad ? -1 : 1;
            }
          });

        this.userService.getDigitadores().pipe(take(1)).subscribe(digitadores =>
        {
          this.filteredRecordList = [];
          listanueva.forEach(item =>
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
              if(item.archivado == 0)
                this.filteredRecordList.push(item);
            });
        })
      });


    }

    handleArchive(idPaciente, idSolicitud, keyPaciente){
      Swal.fire({
        title: '¿Seguro que desea archivar la solicitud?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Archivar',
        cancelButtonText: 'Cancelar'
      }).then(result => {
        if (result.isConfirmed) {
          this.recordService.archivarSolicitud(idPaciente,idSolicitud,keyPaciente, 1);
          Swal.fire(
            'Solicitud archivada',
            'La solicitud ha sido archivada exitosamente',
            'success'
          );
          this.modalService.dismissAll();
        }
      });
    }

    handleUnarchive(idPaciente, idSolicitud, keyPaciente){
      Swal.fire({
        title: '¿Seguro que desea desarchivar la solicitud?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Desarchivar',
        cancelButtonText: 'Cancelar'
      }).then(result => {
        if (result.isConfirmed) {
          this.recordService.archivarSolicitud(idPaciente,idSolicitud, keyPaciente, 0);
          Swal.fire(
            'Solicitud desarchivada',
            'La solicitud ha sido desarchivada exitosamente',
            'success'
          );
          this.modalService.dismissAll();
          this.showArchived = false;
          (document.getElementById("checkArchived") as any).checked = false;
          this.actualState = "Todos";
          (document.getElementById("Todos") as any).selected = "true";
        }
      });
    }

    getPacienteData(id) {
      let patient = this.patientService.getPacientById(id);
    }

    onSelectedChange(event:any){
        const state = event.target.value;
        this.actualState = state;
        if (state == "Todos") {
            this.filteredRecordList = this.recordList.filter(record => record.archivado === +this.showArchived);
        } else {
            this.filteredRecordList = this.recordList.filter(record => {
                return record.estado == state;
            }).filter(record => record.archivado === +this.showArchived);
        }
    }

    onCheckboxChange(event:any){
      this.showArchived = event.target.checked;
      if(this.actualState == "Todos"){
        this.filteredRecordList = this.recordList.filter(record => record.archivado === +this.showArchived);
      } else {
        this.filteredRecordList = this.recordList.filter(record => {
            return record.estado == this.actualState;
        }).filter(record => record.archivado === +this.showArchived);
      }
    }

    open(content) {
        this.modalService.open(content, { size: 'xl', backdrop: 'static', ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
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
        this.getPacienteData(selectedItem.IDPaciente);

        this.solicitudSelectedName = selectedItem.queSolicita;
        this.solicitudSelectedId = selectedItem.solicitudKey;
        this.pacienteSelectedId = selectedItem.IDPaciente; //MANDAR LA CEDULA
        this.pacienteSelectedKey = selectedItem.pacienteKey;
        this.solicitudPreEdicion = selectedItem.rawSolicitud;
        if(selectedItem.estado === "Falta más información"){
          // (document.getElementById("nombre") as any).disabled = false;
          // (document.getElementById("ciudad") as any).disabled = false;
          // (document.getElementById("hoja-div") as any).hidden = false;
          (document.getElementById("estudio-div") as any).hidden = false;
          (document.getElementById("solicitud-div") as any).hidden = false;
          (document.getElementById("otros-div") as any).hidden = false;

          (document.getElementById("solicitud") as any).disabled = false;
          (document.getElementById("descripcion") as any).disabled = false;
          (document.getElementById("prioridadOptions") as any).disabled = false;
        }

        if (selectedItem.estado === "Aprobada" || selectedItem.estado === "Denegada") {
          if (selectedItem.archivado === 0) {
            document.getElementById("btn-box").style.display = "inline";
          } else {
            document.getElementById("btn-box-open").style.display = "inline";
          }
        }

        document.getElementById("id-paciente").setAttribute('value', selectedItem.IDPaciente);
        document.getElementById("nombre").setAttribute('value', selectedItem.nombrePaciente);
        document.getElementById("ciudad").setAttribute('value', selectedItem.ciudad);
        document.getElementById("estado").setAttribute('value', selectedItem.estado);
        document.getElementById("solicitud").setAttribute('value', selectedItem.queSolicita);
        document.getElementById("fecha").innerHTML = selectedItem.fecha;

        document.getElementById("hoja").setAttribute('href', selectedItem.hojaComp);
        if(selectedItem.otros != '') document.getElementById("otros").setAttribute('href', selectedItem.otros);
        if(selectedItem.estudioSE != '') document.getElementById("estudio").setAttribute('href', selectedItem.estudioSE);
        if(selectedItem.solicitudDonacion != '') document.getElementById("donacion").setAttribute('href', selectedItem.solicitudDonacion);

        (<HTMLInputElement>document.getElementById("descripcion")).value = selectedItem.descripcion;
        (<HTMLInputElement>document.getElementById("comentarioP")).value = selectedItem.comentariosPresidencia;
        document.getElementById("image_preview").setAttribute('src', selectedItem.imgCasa1);
        document.getElementById("image_preview2").setAttribute('src', selectedItem.imgCasa2);
        if (selectedItem.imgCasa2 == "") document.getElementById("image_preview2").style.visibility = "hidden";

        var selectorPrioridad = document.getElementById("prioridadOptions");
        var optionPrioridad1 = document.createElement("option");
        var optionPrioridad2 = document.createElement("option");
        var optionPrioridad3 = document.createElement("option");

        if(selectedItem.prioridad == 1)
        {
          optionPrioridad1.innerHTML = "Inmediata";
          optionPrioridad1.selected = true;

          optionPrioridad2.innerHTML = "Alta"
          optionPrioridad3.innerHTML = "Baja"

        }else if(selectedItem.prioridad == 2){
          optionPrioridad1.innerHTML = "Alta";
          optionPrioridad1.selected = true;

          optionPrioridad2.innerHTML = "Inmediata"
          optionPrioridad3.innerHTML = "Baja"
        }else{
          optionPrioridad1.innerHTML = "Baja";
          optionPrioridad1.selected = true;

          optionPrioridad2.innerHTML = "Inmediata"
          optionPrioridad3.innerHTML = "Alta"
        }
        selectorPrioridad.appendChild(optionPrioridad1);
        selectorPrioridad.appendChild(optionPrioridad2);
        selectorPrioridad.appendChild(optionPrioridad3);

        this.socioeconomico = selectedItem.estudioSE;
        this.solDonacion = selectedItem.solicitudDonacion;
        this.otros = selectedItem.otros;
        this.hoja = selectedItem.hojaComp;

        this.nombrePaciente = selectedItem.nombrePaciente;
        this.digitadorMod = selectedItem.nombreDigitador;


        // console.log(selectedItem);

      }

      actualizarSolicitud(content) {
        this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
          console.log(`Closed with: ${result}`);
        }, (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        });
      }

      onEditConfirmation(solicitud: string){
        console.log(solicitud);
        document.getElementById("solicitudUpdate").setAttribute('value', solicitud);
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

      callUpdateNotification(){
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: '¡Solicitud ha sido actualizada exitosamente!',
          showConfirmButton: false,
          timer: 1500
        })
      }

      getValues(){
        console.log("Hereeee");
        var idPacienteVal = document.getElementById('id-paciente') as HTMLInputElement;
        var nombreVal = document.getElementById('nombre') as HTMLInputElement;
        var ciudadVal = document.getElementById('ciudad') as HTMLInputElement;
        var solicitudVal = document.getElementById('solicitud') as HTMLInputElement;
        var descripcionVal = document.getElementById('descripcion') as HTMLTextAreaElement;
        var prioridadVal = document.getElementById('prioridadOptions') as HTMLSelectElement;
        console.log(idPacienteVal.value);
        let idPacienteValue = idPacienteVal.value;
        let nombreValue = nombreVal.value;
        let ciudadValue = ciudadVal.value;
        let solicitudValue = solicitudVal.value;
        let descripcionValue = descripcionVal.value;
        let prioridadValue = prioridadVal.options[prioridadVal.selectedIndex].text;

        var prioridadSend;
        if(prioridadValue === 'Inmediata'){
          prioridadSend = 1,
          this.prioridadString = "Inmediata"
        }else if(prioridadValue === 'Alta'){
          prioridadSend = 2,
          this.prioridadString = "Alta"
        }else{
          prioridadSend = 3,
          this.prioridadString ="Baja"
        }

        this.IDPaciente = idPacienteValue;
        this.nombre = nombreValue;
        this.descripcion =  descripcionValue;
        this.ciudad = ciudadValue;
        this.solicitud = solicitudValue;
        this.prioridad= prioridadSend;
        this.prioridadEmail = prioridadValue;
        this.estado = "En espera";

      }

      getRequestPriority(priority){
        const priorities = [
          "Inmediata",
          "Alta",
          "Baja",
        ];

        return priorities[priority-1]
      }

      editarSolicitud(pacienteID, solicitudID, solicitud){
        // this.getValues();
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
          this.recordService.editarSolicitud(pacienteID, solicitudID, solicitud, this.descripcion, this.estado, this.archivado, this.prioridad, this.solicitud, this.socioeconomico, this.solDonacion, this.otros)
            .then(() => {
              this.callUpdateNotification();
              Email.send({
                SecureToken: "c4c2a6e5-ad26-49e5-8f8d-4468439ac72c",
                To: 'aaron20092009@hotmail.com',
                From: 'lopez.aaron1022@gmail.com',
                Subject: `Solicitud Modificada - ${this.solicitud} - Prioridad(${this.prioridadEmail})`,
                Body: `Paciente ${this.nombrePaciente} con No. Identidad ${this.IDPaciente}
                      <br>Descripcion: ${this.descripcion}
                      <br>Modificado por Digitador: ${this.digitadorMod}`
              }).then(
                message => console.log(message)
              );
            })

        });
        this.fileList = [];
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
