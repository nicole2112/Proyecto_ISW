import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from '@angular/fire/compat/database';
import { ModalDirective } from 'angular-bootstrap-md';
import { data } from 'jquery';
import { observable, Observable, of, from } from 'rxjs';
import { Patient } from '../models/patient';

@Injectable({

providedIn:'root',

})

export class RetrievePatientService {

FundacionRef: AngularFireList<any>;
PacientRef: AngularFireObject<any>;
Patient : any[];
SinglePatient: any;

constructor(private db:AngularFireDatabase) { }

getPatients(): Observable<Patient[]>{

    this.FundacionRef = this.db.list('pacientes');

    this.FundacionRef.snapshotChanges().subscribe(data =>{
        this.Patient = [];
        data.forEach(patient =>{
            let p = patient.payload.toJSON();
            p['$key'] = patient.key;
            this.Patient.push(p as Patient);
        })
        //console.table(this.Patient);
    })
   return of(this.Patient);
}

getPacientById(id): Observable<Patient>{
  this.db.object("/pacientes/"+id).valueChanges().subscribe(data => {
    this.SinglePatient = data;
    console.log(data);
  })
  console.log("aca");
  console.log(this.SinglePatient);
  return of(this.SinglePatient);
}

}
