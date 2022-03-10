import { Component } from '@angular/core';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import { take } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { AuthenticationService } from '../services/auth.services';
import { SolicitudesService } from "../services/solicitudes.service";
import { PacientesService } from "../services/pacientes.service";
import { AngularFireList } from '@angular/fire/compat/database';
import { FormsModule }   from '@angular/forms';

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

    /////
    solicitudesRef: AngularFireList<any>;
    
    solicitudesPacientesList :any[] =[];
    listSoliPacienteFiltered :any[]=[];
    CedulaPaciente: any;

    filtro=[
      'Aprobada',
      'Denegada'
    ];

    constructor(public service: AuthenticationService,private solicitudservice: SolicitudesService, private pacienteService: PacientesService) {}

    buscarPaciente(){
      var id = this.CedulaPaciente;
      
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
      
      this.solicitudservice.getSolicitud_x_Paciente(id).subscribe(records => {
        this.listaSolicitudes = records.sort((a, b) => {
            let dateA = new Date(b.fecha), dateB = new Date(a.fecha)
            return +dateA - +dateB;
        });
        this.listaOrd = this.listaSolicitudes;
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

}