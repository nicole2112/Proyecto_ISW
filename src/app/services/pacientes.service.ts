import { Injectable } from '@angular/core';
import {
  AngularFireDatabase,
  AngularFireList,
} from '@angular/fire/compat/database';
import { getDatabase, set } from 'firebase/database';
import { getDownloadURL, getStorage, uploadBytes, ref } from 'firebase/storage';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Pacientes } from '../models/pacientes';
import { AuthenticationService } from './auth.services';

@Injectable({
  providedIn: 'root',
})
export class PacientesService {
  pacienteRef: AngularFireList<any>;
  listaPacientes: any[];
  pacientes = [];

  urlList: any[] = [];
  Pacientes = [];

  constructor(
    private db: AngularFireDatabase,
    public service: AuthenticationService
  ) {}

  getPaciente(identidad): Observable<any[]> {
    this.pacienteRef = this.db.list('pacientes');

    return this.pacienteRef.snapshotChanges().pipe(
      map((data) => {
        this.listaPacientes = [];
        data.forEach((paciente) => {
          let a = paciente.payload.toJSON();
          if (a['id'] == identidad) {
            this.listaPacientes.push(a);
          }
        });
        return this.listaPacientes;
      })
    );
  }

  getAllPacientes(): Observable<any[]> {
    this.pacienteRef = this.service.db.list('pacientes');
    return this.pacienteRef.snapshotChanges().pipe(map(data =>{
      this.Pacientes =[];
      data.forEach(pac =>{
        let a = pac.payload.toJSON();
        a['key'] = pac.key;
        this.Pacientes.push(a);
      })
      return this.Pacientes;
    }))

  }

  agregarPaciente(
    id,
    nombre,
    ciudad,
    domicilio,
    telefono,
    notas,
    contacto,
    contactoTel,
    hojaComp,
    imgCasa1,
    imgCasa2,
    imgCedula1,
    imgCedula2,
    estado
  ) {
    let PacienteItem = {
      id: id,
      nombre: nombre,
      ciudad: ciudad,
      domicilio: domicilio,
      telefono: telefono,
      notas: notas,
      contacto: contacto,
      contactoTel: contactoTel,
      hojaComp: hojaComp,
      imgCasa1: imgCasa1,
      imgCasa2: imgCasa2,
      imgCedula1: imgCedula1,
      imgCedula2: imgCedula2,
      estado: estado,
    };
    this.db.list('pacientes').push(PacienteItem);
  }

  async guardarArchivos(archivo) {
    return new Promise(async (resolve) => {
      let filename = archivo.name;

      const storage = getStorage();
      const storageRef = ref(storage, filename);

      uploadBytes(storageRef, archivo)
        .then((snapshot) => {})
        .then(() => {
          getDownloadURL(storageRef)
            .then((data) => {
              this.urlList.push(data);
              resolve(data);
            })
            .catch();
        });
    });
  }

  getPaciente2(identidad): Observable<any>{
    this.pacienteRef = this.db.list('pacientes');

    let pac:any;
    
    return this.pacienteRef.snapshotChanges().pipe(map(data => {
        this.listaPacientes = [];
        data.forEach(paciente => {
          let a = paciente.payload.toJSON();
          if(a['id'] == identidad){
            pac = a;
          }
        })
        return pac;
      }))
}
}