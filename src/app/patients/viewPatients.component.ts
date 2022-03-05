import { Component } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { threadId } from 'worker_threads';
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

  pacienteSelectedKey: any;
  newHojaComp: any = "";
  newImgCasa1: any = "";
  newImgCasa2: any = "";
  newImgCedula1: any = "";
  newImgCedula2: any = "";

  fileList: any[] = [];
  descList: any[] = [];

  pacienteRef: AngularFireList<any>;
  Pacientes = [];

  filteredRecordList = [];
    states = [
        'Activo',
        'Inactivo',
    ];
  

  constructor(
    public service: AuthenticationService,
    public pacientes: PacientesService,
    private modalService: NgbModal,
    public pacienteService: PacientesService,
    private db:AngularFireDatabase
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
        a['$key'] = pac.key;
        this.Pacientes.push(a);
      });
      this.filteredRecordList = this.Pacientes;
    });
  }

  onSelectedChange(event: any){
    const state = event.target.value;
    if(state == "Todos"){
      this.filteredRecordList = this.Pacientes;
    }else{
      this.filteredRecordList = this.Pacientes.filter(record =>{
        return record.estado == state;
      })
    }
  }

  //Funciones para el modal
  open(paciente:Pacientes, content, key: string){
    this.pacienteSelectedKey = key;
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

    this.modalService.open(content, { size: 'lg' ,backdrop: 'static', ariaLabelledBy: 'modal-basic-title', animation: true }).result.then((result)=>{
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

  openConfirmation(content){
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title'}).result.then((result)=>{
      //console.log(`Closed with: ${result}`);
    }, (reason)=>{
      //this.closeResult = `Dismissed ${this.getDismissReason(reason)}`
    })
  }

  closeAll(){
    this.modalService.dismissAll("Changes made");
  }

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
  }

  modificarPaciente(){
    this.getValues();
    Promise.all(this.fileList.map(async (file) => {
      return this.pacienteService.guardarArchivos(file);
    })).then((message) =>{
      this.descList.forEach((item, index) =>{
        switch (item) {
          case 'newImgCasa1':
            console.log(index);
            this.imgCasa1 = message[index];
            break;
          case 'newImgCasa2':
            this.imgCasa2 = message[index];
            break;
          case 'newImgCedula1':
            this.imgCedula1 = message[index];
            break;
          case 'newImgCedula2':
            this.imgCedula2 = message[index];
            break;
        }
      });
      this.actualizarPaciente(this.pacienteSelectedKey, this.hojaComp, this.imgCasa1, this.imgCasa2, this.imgCedula1, this.imgCedula2);
      this.callSendFunction();
    });
  }

  actualizarPaciente(key, hojaComp, imgCasa1, imgCasa2, imgCedula1, imgCedula2){
    let pacienteItem={};
    const userRef = this.db.object('pacientes/' + key);  
    
   pacienteItem ={
        "nombre" : this.nombre,
        "ciudad" : this.ciudad,
        "domicilio" : this.domicilio,
        "telefono" :this.telefono,
        "notas" : this.notas,
        "contacto" : this.contacto,
        "contactoTel": this.contactoTel,
        "hojaComp": hojaComp,
        "imgCasa1": imgCasa1,
        "imgCasa2": imgCasa2,
        "imgCedula1" : imgCedula1,
        "imgCedula2" : imgCedula2,
        "estado": this.estado
    }
    userRef.update(pacienteItem);
    this.fileList=[];
    this.descList=[];
    this.newImgCasa1 = "";
    this.newImgCasa2 = "";
    this.newImgCedula1 = "";
    this.newImgCedula2 = "";
}


  getValues(){
    var estadoVal = document.getElementById('estadoOptions') as HTMLSelectElement;
    let estadoValue = estadoVal.options[estadoVal.selectedIndex].text;
    this.estado = estadoValue;
  }


  callSendFunction() {
    Swal.fire({
      position: 'top-end',
      icon: 'success',
      title: '¡Paciente actualizado con éxito!',
      showConfirmButton: false,
      timer: 1500,
    });
  }
}
