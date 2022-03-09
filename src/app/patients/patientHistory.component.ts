import { Component } from '@angular/core';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import { take } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { AuthenticationService } from '../services/auth.services';
import { SolicitudesService } from "../services/solicitudes.service";
import { PacientesService } from "../services/pacientes.service";

@Component({
  selector: 'app-patient-history',
  templateUrl: './patientHistory.component.html',
  styleUrls: ['./patientHistory.component.css'],
})
export class PatientHistoryComponent {


    miPaciente: any;
    type: any =0;
    listaSolicitudes: any;
    listaOrd: any;

    constructor(public service: AuthenticationService,private solicitudservice: SolicitudesService, private pacienteService: PacientesService) {}

    buscarPaciente(){
      var id = (<HTMLInputElement>document.getElementById("num")).value;
      
      this.pacienteService.getPaciente(id).subscribe(paciente => {
          this.miPaciente = paciente[0];
          if(this.miPaciente == null)
          {
            this.type = 2;
          }
          else{
            this.type = 1;

          }  
      });;
      
      this.solicitudservice.getSolicitudes(id).subscribe(records => {
        this.listaSolicitudes = records.sort((a, b) => {
            let dateA = new Date(b.fecha), dateB = new Date(a.fecha)
            return +dateA - +dateB;
        });
        this.listaOrd = this.listaOrd;
    });
      
  }

}