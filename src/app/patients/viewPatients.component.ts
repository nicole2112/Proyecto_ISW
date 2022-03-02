import { Component } from '@angular/core';
import { AngularFireList } from '@angular/fire/compat/database';
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
  pacienteRef: AngularFireList<any>;
  Pacientes = [];

  constructor(
    public service: AuthenticationService,
    public pacientes: PacientesService
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
}
