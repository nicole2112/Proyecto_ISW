import { Component, EventEmitter, Output } from '@angular/core';
import { resolve } from 'dns';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import { take } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { AuthenticationService } from '../services/auth.services';
import { PacientesService } from '../services/pacientes.service';

@Component({
  selector: 'app-add-patient',
  templateUrl: './addPatient.component.html',
  styleUrls: ['./addPatient.component.css'],
})
export class AddPatientComponent {
  id: any;
  nombre: any;
  ciudad: any;
  domicilio: any = "";
  telefono: any;
  notas: any = "";
  contacto: any;
  contactoTel: any;
  hojaComp: any;
  imgCasa1: any;
  imgCasa2: any = "";
  imgCedula1: any;
  imgCedula2: any = "";
  estado: any = 'Activo';
  namePattern = '^[a-zA-Z ]*$';

  fileList: any[] = [];
  descList: any[] = [];
  urlList: any[] = [];

  constructor(
    public service: AuthenticationService,
    public pacienteService: PacientesService
  ) {}

  @Output() viewPatientsRedirect = new EventEmitter<boolean>();

  viewPatientsRedirectFunc() {
    this.viewPatientsRedirect.emit(true);
  }

  //Para la selección de archivos
  onDragOver(event) {
    event.preventDefault();
  }
  // From drag and drop
  onDropSuccess(event) {
    event.preventDefault();
    this.onFileChange(event.dataTransfer.files, event.target.name); // notice the "dataTransfer" used instead of "target"
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

  savePatient() {
    Promise.all(
      this.fileList.map(async (file) => {
        console.log('1');
        return this.guardarArchivos(file);
      })
    ).then((message) => {
      console.log(message);

      this.descList.forEach((item, index) => {
        switch (item) {
          case 'hojaComp':
            this.hojaComp = message[index];
            break;
          case 'imgCasa1':
            this.imgCasa1 = message[index];
            break;
          case 'imgCasa2':
            this.imgCasa2 = message[index];
            break;
          case 'imgCedula1':
            this.imgCedula1 = message[index];
            break;
          case 'imgCedula2':
            this.imgCedula2 = message[index];
            break;
        }
      });
      this.pacienteService.agregarPaciente(
        this.id,
        this.nombre,
        this.ciudad,
        this.domicilio,
        this.telefono,
        this.notas,
        this.contacto,
        this.contactoTel,
        this.hojaComp,
        this.imgCasa1,
        this.imgCasa2,
        this.imgCedula1,
        this.imgCedula2,
        this.estado
      );
      this.viewPatientsRedirectFunc();
      this.callSendFunction();
    });

  }

  async guardarArchivos(archivo) {
    return new Promise(async (resolve) => {
      let filename = archivo.name;

      const storage = getStorage();
      const storageRef = ref(storage, filename);

      uploadBytes(storageRef, archivo)
        .then((snapshot) => {})
        .then(() => {
          getDownloadURL(storageRef)
            .then((data) => {
              this.urlList.push(data);
              console.log('3');
              resolve(data);
            })
            .catch((error) => [console.log(error)]);
        });
    });
  }

  callSendFunction() {
    Swal.fire({
      position: 'top-end',
      icon: 'success',
      title: '¡Paciente agregado con éxito!',
      showConfirmButton: false,
      timer: 1500,
    });
  }
}
