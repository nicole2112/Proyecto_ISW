import { Component, EventEmitter, Output } from '@angular/core';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import { take } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { AuthenticationService } from '../services/auth.services';

@Component({
  selector: 'app-add-patient',
  templateUrl: './addPatient.component.html',
  styleUrls: ['./addPatient.component.css'],
})

export class AddPatientComponent {
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
  estado: any = 'Activo';
  namePattern = '^[a-zA-Z ]*$';

  fileList: any[] = [];
  descList: any[] = [];

  constructor(public service: AuthenticationService) {}

  @Output() viewPatientsRedirect = new EventEmitter<boolean>();

  viewPatientsRedirectFunc(){
    this.viewPatientsRedirect.emit(true);
  }

  //Para la selección de archivos
  onDragOver(event) {
      event.preventDefault();
  }
  // From drag and drop
  onDropSuccess(event) {
    event.preventDefault();
    this.onFileChange(event.dataTransfer.files, event.target.name);    // notice the "dataTransfer" used instead of "target"
  }
  // From attachment link
  onChange(event){  
    this.onFileChange(event.target.files, event.target.name);    // "target" is correct here
  }
  private onFileChange(files: File[], descArchivo: string){
    if(!files[0]) {
      Swal.fire({
          position: 'top-end',
          icon: 'warning',
          title: 'Debe seleccionar un archivo.',
          showConfirmButton: false,
          timer: 1500
        })
      return;
    }
    this.fileList.push(files[0]);
    this.descList.push(descArchivo);
  }

  savePatient(){
    this.viewPatientsRedirectFunc();
    this.callSendFunction();
  }

  callSendFunction(){
    Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: '¡Paciente agregado con éxito!',
        showConfirmButton: false,
        timer: 1500
    })
}

}