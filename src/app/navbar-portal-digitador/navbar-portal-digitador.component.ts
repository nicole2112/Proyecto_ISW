import { Component, ElementRef, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { AuthenticationService } from '../services/auth.services';
import firebase from '@firebase/app-compat';
import { faUserCircle, faDollyFlatbed, faHandHoldingUsd } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';

@Component({
    selector: 'app-navbar-portal-digitador',
    templateUrl: './navbar-portal-digitador.component.html',
    styleUrls: ['./navbar-portal-digitador.component.css']
  })

export class NavbarPortalDigitadorComponent {

    constructor( public service: AuthenticationService, private eRef: ElementRef, private router: Router) { }

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

    faUserCircle = faUserCircle;
    faDollyFlatbed = faDollyFlatbed;
    faHandHoldingUsd = faHandHoldingUsd;

}