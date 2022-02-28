import { Component, ElementRef, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from '@angular/fire/compat/database';
import { User } from '../models/user';

@Component({
    selector: 'app-portal-digitador',
    templateUrl: './portal-digitador.component.html',
    styleUrls: ['./portal-digitador.component.css']
  })

export class PortalDigitadorComponent implements OnInit{

  toggleAddSolicitud = false;
  toggleHistorial = false;
  toggleFormularios = false;
  toggleViewPatients = false;
  toggleAddPatient  = false;
  togglePatientHistory = false;

  constructor(public auth: AngularFireAuth, private db:AngularFireDatabase, private eRef: ElementRef) { }

  FundacionRef: AngularFireList<any>;

  ngOnInit(): void {
    
  }
}