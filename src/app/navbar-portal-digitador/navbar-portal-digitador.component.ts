import { Component, ElementRef, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { AuthenticationService } from '../services/auth.services';
import { faUserCircle, faDollyFlatbed, faHandHoldingUsd } from '@fortawesome/free-solid-svg-icons';

@Component({
    selector: 'app-navbar-portal-digitador',
    templateUrl: './navbar-portal-digitador.component.html',
    styleUrls: ['./navbar-portal-digitador.component.css']
  })

export class NavbarPortalDigitadorComponent {
    constructor( public service: AuthenticationService, private eRef: ElementRef) { }

    ngOnInit(): void {
    }
    
    logOut(){
      this.service.logout();
    }

    faUserCircle = faUserCircle;
    faDollyFlatbed = faDollyFlatbed;
    faHandHoldingUsd = faHandHoldingUsd;

}