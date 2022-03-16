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
    
    solicitudesPacientesList :any[] = [];
    listSoliPacienteFiltered :any[] = [];
    listTodasSolicitudes: any[] = [];
    CedulaPaciente: any;

    keySolicitudes: any[];

    filtro=[
      'Aprobada',
      'Denegada'
    ];

    opcionFiltro:any;

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
    this.solicitudesRef = this.service.db.list('pacientes'); //leer aqui la tabla de los pacientes
    this.solicitudesRef.valueChanges().pipe(take(1)).subscribe(pacientes =>{
      this.solicitudesPacientesList =[];
      let keys = Object.keys(pacientes);
      keys.forEach((pac) =>{
        //let a = pac.payload.toJSON();      
        if(pacientes[pac]['id'] == this.CedulaPaciente){
            this.solicitudesPacientesList = pacientes[pac]['Solicitudes'];
        }
      })

      let keysPac = Object.keys(this.solicitudesPacientesList);
      keysPac.forEach(element => {
        if(this.solicitudesPacientesList[element]['estado'] == "Aprobada" || this.solicitudesPacientesList[element]['estado'] == "Denegada"){
          this.listTodasSolicitudes.push(this.solicitudesPacientesList[element]);
          this.listSoliPacienteFiltered.push(this.solicitudesPacientesList[element]);
        }
      });
      
      //this.listSoliPacienteFiltered = this.solicitudesPacientesList;
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
    let keys = Object.keys(this.listTodasSolicitudes  );
    if(filter == "Todos"){
      this.listSoliPacienteFiltered = this.listTodasSolicitudes;
    }else if(filter == "Aprobada"){
      this.listSoliPacienteFiltered =[];
      keys.forEach((data)=>{
        if(this.listTodasSolicitudes  [data]['estado'] == "Aprobada"){
          this.listSoliPacienteFiltered.push(this.listTodasSolicitudes  [data]);
        }
      })
    }else{
      this.listSoliPacienteFiltered =[];
      keys.forEach((data)=>{
        if(this.listTodasSolicitudes  [data]['estado'] == "Denegada"){
          this.listSoliPacienteFiltered.push(this.listTodasSolicitudes  [data]);
        }
      })
    }
  }

  // onSelectedChangeBuscarPaciente(event: any){
  //   const filter = event.target.value;
  //   if(filter == "Todos"){
  //     this.listSoliPacienteFiltered = this.solicitudesPacientesList;
  //   }else{
  //     this.listSoliPacienteFiltered = this.solicitudesPacientesList.filter(record =>{
  //       return record.estado == filter;
  //     });
  //   }
  // }


}