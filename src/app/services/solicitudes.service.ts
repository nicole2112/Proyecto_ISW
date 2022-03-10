import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database';
import { observable, Observable, of, from } from 'rxjs';
import { concatMap, map } from 'rxjs/operators';
import Swal from 'sweetalert2'
import { AuthenticationService } from './auth.services';
import firebase from '@firebase/app-compat';
import { getDatabase, ref, set } from "firebase/database";
import { PacientesService } from './pacientes.service';

@Injectable({
  providedIn: 'root'
})
export class SolicitudesService {

  private user: firebase.default.User = null;

  solicitudRef: AngularFireList<any>;
  refer: AngularFireList<any>;

  listaSolicitudes: any[]=[];
  listaCorrecta: any[]=[];
  listaPac: any[]=[];

  constructor(private db: AngularFireDatabase, private auth: AuthenticationService, private pacienteService: PacientesService) {

  }

  getTodasSolicitudes(id): Observable<any[]> {

    this.refer = this.db.list('solicitudes');

    return this.refer.snapshotChanges().pipe(map(data => {
      data.forEach( solicitud => {
        let a = solicitud.payload.toJSON();
        a['key'] = solicitud.key;
        if (a['digitador'] == id || id == "ZQjKhXkpXPZJQ5UbT14JsFE8rvu2")
          this.listaSolicitudes.push(a);
      })
      return this.listaSolicitudes;
    }));

  }

  async isPresidente()
  {
    return this.auth.isPresdente().subscribe(data =>
      {
        return data;
      });
  }

  getSolicitud(idSol): Observable<any> {

    this.refer = this.db.list('solicitudes');

    return this.refer.snapshotChanges().pipe(map(data => {
      let nuevaSol: any;
      this.listaSolicitudes = [];
      data.forEach(solicitud => {
        let a = solicitud.payload.toJSON();
        a['key'] = solicitud.key;
        if (a['id'] == idSol)
        {
          nuevaSol = a;
        }
      })
      return nuevaSol;
    }))
  }

  getSolicitud_x_Paciente(idPaciente): Observable<any[]>{
    this.solicitudRef = this.db.list('solicitudes');

    return this.solicitudRef.snapshotChanges().pipe(map(data =>{
      this.listaSolicitudes=[];
      data.forEach(solicitud =>{
        let a = solicitud.payload.toJSON();
        a['key'] = solicitud.key;
        if(a['IDPaciente'] == idPaciente){
          this.listaSolicitudes.push(a);
        }
      })
      return this.listaSolicitudes;
    }))
  }

  postSolicitud(descripcionCaso, IDPaciente, prioridad, comentariosPresidencia, queSolicita, estudioSE, archivoSolicitud, archivoAdicional, fecha) {
    let solicitud = {
      "descripcion": descripcionCaso,
      "digitador": this.auth.userDetails.uid,
      "IDPaciente": IDPaciente,
      "estado": "En espera",
      "prioridad": prioridad,
      "comentariosPresidencia": comentariosPresidencia,
      "queSolicita": queSolicita,
      "estudioSE": estudioSE,
      "solicitudDonacion": archivoSolicitud,
      "otros": archivoAdicional,
      "archivado": 0,
      "fecha": fecha
    };

    this.db.list(`solicitudes`).push(solicitud).then((data) => {
      solicitud["id"] = data.key;
      this.db.object(`solicitudes/${data.key}`).set(solicitud);
    });
  }

  editarSolicitud(id, descripcionCaso, estado, archivado, prioridad, queSolicita, estudioSE, archivoSolicitud, archivoAdicional) {

    this.getSolicitud(id).subscribe( solicitud =>
      {
        console.log(solicitud);
        solicitud["descripcion"]= descripcionCaso;
        solicitud["estado"]= estado;
        solicitud["prioridad"]= prioridad;
        solicitud["queSolicita"]= queSolicita;
        solicitud["estudioSE"]= estudioSE;
        solicitud["solicitudDonacion"]= archivoSolicitud;
        solicitud["otros"]= archivoAdicional;
        solicitud["archivado"]= archivado;

        this.db.object(`solicitudes/${id}`).set(solicitud);
      });
  }

  actualizarArchivo(urlArchivo, id, archivoNombre) {
    const db = getDatabase();

    let objeto = {};
    objeto[archivoNombre] = urlArchivo;

    set(ref(db, 'solicitudes/' + id), objeto);
  }

}
