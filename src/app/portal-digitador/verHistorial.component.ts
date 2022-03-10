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
    solicitudSelectedId: any;

    nombre: any;
    ciudad: any;

    constructor(private service: AuthenticationService, private recordService: SolicitudesService, private pacService: PacientesService, private patientService: RetrievePatientService, private userService: RetrieveUsersService, private modalService: NgbModal) { }

    async ngOnInit() {

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

    getPacienteData(id) {
      let patient = this.patientService.getPacientById(id);
      console.log(patient);
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
        this.modalService.open(content, { size: 'xl', backdrop: 'static', ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
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
        this.getPacienteData(selectedItem.IDPaciente);
        console.log(selectedItem.key);
        this.solicitudSelectedId = selectedItem.key;
        if(selectedItem.estado === "En espera"){
          // (document.getElementById("nombre") as any).disabled = false;
          // (document.getElementById("ciudad") as any).disabled = false;
          (document.getElementById("solicitud") as any).disabled = false;
          (document.getElementById("descripcion") as any).disabled = false;
          (document.getElementById("prioridadOptions") as any).disabled = false;
        }

        document.getElementById("id-paciente").setAttribute('value', selectedItem.IDPaciente);
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
        // (<HTMLInputElement>document.getElementById("comentario")).value = selectedItem.comentario;
        (<HTMLInputElement>document.getElementById("comentarioP")).value = selectedItem.comentariosPresidencia;
        //console.log(selectedItem);
        

        var selectorPrioridad = document.getElementById("prioridadOptions");
        var optionPrioridad1 = document.createElement("option");
        var optionPrioridad2 = document.createElement("option");
        var optionPrioridad3 = document.createElement("option");

        console.log("Prioridad");
        console.log(selectedItem.prioridad);

        if(selectedItem.prioridad == 1)
        {
          optionPrioridad1.innerHTML = "Inmediata";
          optionPrioridad1.selected = true;

          optionPrioridad2.innerHTML = "Alta"
          optionPrioridad3.innerHTML = "Baja"

        }else if(selectedItem.prioridad == 2){
          optionPrioridad1.innerHTML = "Inmediata";
          optionPrioridad1.selected = true;

          optionPrioridad2.innerHTML = "Alta"
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

      getValues(){
        var nombreVal = document.getElementById('nombre') as HTMLInputElement;
        var ciudadVal = document.getElementById('ciudad') as HTMLInputElement;
        var solicitudVal = document.getElementById('solicitud') as HTMLInputElement;
        var descripcionVal = document.getElementById('descripcion') as HTMLTextAreaElement;

        let nombreValue = nombreVal.value;
        let ciudadValue = ciudadVal.value;
        let solicitudValue = solicitudVal.value;
        let descripcionValue = descripcionVal.value;

        var prioridadSend;
        let updateValue = {};

        this.nombre = nombreValue;
        this.descripcion =  descripcionValue;
        this.ciudad = ciudadValue;
        this.solicitud = solicitudValue;
        this.prioridad= prioridadSend;
      }

      editarSolicitud(id){
        console.log("ID ACA: ");
        console.log(id);
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
