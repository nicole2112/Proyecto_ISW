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
  contacto: any;
  contactoTel: any;
  notas: any;
  hojaComp: any;
  imgCasa1: any;
  imgCasa2: any;
  imgCedula: any;
  estado: any;
  namePattern = '^[a-zA-Z ]*$';

  constructor(public service: AuthenticationService) {}

  @Output() viewPatientsRedirect = new EventEmitter<boolean>();

  viewPatientsRedirectFunc(){
    this.viewPatientsRedirect.emit(true);
  }

}