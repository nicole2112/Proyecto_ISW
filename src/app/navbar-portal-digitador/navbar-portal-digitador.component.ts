import { Component, ElementRef, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { AuthenticationService } from '../services/auth.services';
import firebase from '@firebase/app-compat';
import { faUserCircle, faDollyFlatbed, faHandHoldingUsd, faFilePdf, faHospitalUser } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';

@Component({
    selector: 'app-navbar-portal-digitador',
    templateUrl: './navbar-portal-digitador.component.html',
    styleUrls: ['./navbar-portal-digitador.component.css']
  })

export class NavbarPortalDigitadorComponent {

    constructor( public service: AuthenticationService, private eRef: ElementRef, private router: Router) { }
    @Input() isShow: boolean;
    @Output() viewRequestHistoryClick: EventEmitter<boolean> = new EventEmitter();
    @Output() addRequestClick: EventEmitter<boolean> = new EventEmitter();
    @Output() viewFormulariosClick: EventEmitter<boolean> = new EventEmitter();
    @Output() viewPatientsClick: EventEmitter<boolean> = new EventEmitter();
    @Output() addPatientClick: EventEmitter<boolean> = new EventEmitter();
    @Output() viewPatientHistoryClick: EventEmitter<boolean> = new EventEmitter();

    ngOnInit(): void {
      this.isLogged();
    }
    
    isLogged(){
      let userexp = '';
      firebase.auth().onAuthStateChanged(function(user){
        if(user){
          document.getElementById('user-display').innerHTML = '<fa-icon class="fa icons" [icon]="faUserCircle"></fa-icon>' + user.email + ' ▼';
        }else{
          console.log('Error');
        }
      })
      console.log(userexp);
      return userexp;
    }

    fnEditUserProfile(){
      this.router.navigateByUrl(`portal-digitador/perfil`);
    }

    logOut(){
      this.service.logout();
    }

    //Solicitudes de donación
    showHistorial(){
      this.viewRequestHistoryClick.emit(true);
    }

    addSolicitud(){
      this.addRequestClick.emit(true);
    }

    //Formularios
    showFormularios(){
      this.viewFormulariosClick.emit(true);
    }

    //Pacientes
    viewPatients(){
      this.viewPatientsClick.emit(true);
    }

    addPatient(){
      this.addPatientClick.emit(true);
    }

    viewPatientHistory(){
      this.viewPatientHistoryClick.emit(true);
    }

    faUserCircle = faUserCircle;
    faDollyFlatbed = faDollyFlatbed;
    faHandHoldingUsd = faHandHoldingUsd;
    faFilePdf = faFilePdf;
    faHospitalUser = faHospitalUser;
}