import { Component } from '@angular/core';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import { take } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { AuthenticationService } from '../services/auth.services';
@Component({
  selector: 'app-patient-history',
  templateUrl: './patientHistory.component.html',
  styleUrls: ['./patientHistory.component.css'],
})
export class PatientHistoryComponent {

    constructor(public service: AuthenticationService) {}

}