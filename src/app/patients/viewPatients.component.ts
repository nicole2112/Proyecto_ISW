import { Component } from '@angular/core';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import { take } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { AuthenticationService } from '../services/auth.services';
@Component({
  selector: 'app-view-patients',
  templateUrl: './viewPatients.component.html',
  styleUrls: ['./viewPatients.component.css'],
})
export class ViewPatientsComponent {

    constructor(public service: AuthenticationService) {}

}