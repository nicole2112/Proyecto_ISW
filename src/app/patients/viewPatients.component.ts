import { Component } from '@angular/core';
import { AngularFireList } from '@angular/fire/compat/database';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import { take } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { Pacientes } from '../models/pacientes';
import { AuthenticationService } from '../services/auth.services';
import { PacientesService } from '../services/pacientes.service';
@Component({
  selector: 'app-view-patients',
  templateUrl: './viewPatients.component.html',
  styleUrls: ['./viewPatients.component.css'],
})
export class ViewPatientsComponent {

  id: any;
  nombre: any;
  ciudad: any;
  domicilio: any;
  telefono: any;
  notas: any;
  contacto: any;
  contactoTel: any;
  hojaComp: any;
  imgCasa1: any;
  imgCasa2: any;
  imgCedula1: any;
  imgCedula2: any;
  estado: any;

  newHojaComp: any;
  newImgCasa1: any;
  newImgCasa2: any;
  newImgCedula1: any;
  newImgCedula2: any;

  fileList: any[] = [];
  descList: any[] = [];

  pacienteRef: AngularFireList<any>;
  Pacientes = [];

  constructor(
    public service: AuthenticationService,
    public pacientes: PacientesService,
    private modalService: NgbModal
  ) {}


  ngOnInit(): void{
    this.verPacientes();
  }

  verPacientes() {
    this.pacienteRef = this.service.db.list('pacientes');
    this.pacienteRef.snapshotChanges().subscribe((data) => {
      this.Pacientes = [];
      data.forEach((pac) => {
        let a = pac.payload.toJSON();
        console.log(a);
        a['$key'] = pac.key;
        this.Pacientes.push(a as Pacientes);
      });
    });
  }

  //Funciones para el modal
  open(paciente:Pacientes, content){
    this.id = paciente.id;
    this.nombre = paciente.nombre;
    this.ciudad = paciente.ciudad;
    this.domicilio = paciente.domicilio;
    this.telefono = paciente.telefono;
    this.notas = paciente.notas;
    this.contacto = paciente.contacto;
    this.contactoTel = paciente.contactoTel;
    this.estado = paciente.estado;
    this.hojaComp = paciente.hojaComp;
    this.imgCasa1 = paciente.imgCasa1;
    this.imgCasa2 = paciente.imgCasa2;
    this.imgCedula1 = paciente.imgCedula1;
    this.imgCedula2 = paciente.imgCedula2;

    this.modalService.open(content, { size: 'lg' ,backdrop: 'static', ariaLabelledBy: 'modal-basic-title'}).result.then((result)=>{
      console.log(`Closed with: ${result}`);
    }, (reason)=>{
      //this.closeResult = `Dismissed ${this.getDismissReason(reason)}`
    })
  }

  onSelect(paciente:Pacientes){
    let estados = document.getElementById("estadoOptions");
    let estadoOp1 = document.createElement("option");
    let estadoOp2 = document.createElement("option");

    estadoOp1.text = paciente.estado;
    estadoOp1.selected = true;

    if(paciente.estado == "Activo"){
      estadoOp2.text = "Inactivo";
    }
    else{
      estadoOp2.text = "Activo";
    }
    
    estados.appendChild(estadoOp1);
    estados.appendChild(estadoOp2);
  }

  /*Para la selección de archivos
  onDragOver(event) {
    event.preventDefault();
  }
  // From drag and drop
  onDropSuccess(event) {
    event.preventDefault();
    this.onFileChange(event.dataTransfer.files, event.target.name); // notice the "dataTransfer" used instead of "target"
  }*/
  // From attachment link
  onChange(event) {
    this.onFileChange(event.target.files, event.target.name); // "target" is correct here
  }
  private onFileChange(files: File[], descArchivo: string) {
    if (!files[0]) {
      Swal.fire({
        position: 'top-end',
        icon: 'warning',
        title: 'Debe seleccionar un archivo.',
        showConfirmButton: false,
        timer: 1500,
      });
      return;
    }
  
    this.fileList.push(files[0]);
    this.descList.push(descArchivo);
    console.log(this.fileList);
  }

}
