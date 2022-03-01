import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database';
import { observable, Observable, of, from } from 'rxjs';
import { map } from 'rxjs/operators';
import Swal from 'sweetalert2'
import { AuthenticationService } from './auth.services';
import firebase from '@firebase/app-compat';
import { getDatabase, ref, set } from "firebase/database";

@Injectable({
  providedIn: 'root'
})
export class SolicitudesService {

  private user: firebase.default.User = null;

  blogRef: AngularFireList<any>;

  listaSolicitudes: any[];

  constructor(private db: AngularFireDatabase, private auth: AuthenticationService) {

  }

  getSolicitudes(id): Observable<any[]> {

    this.blogRef = this.db.list('solicitudes');

    return this.blogRef.snapshotChanges().pipe(map(data => {
      this.listaSolicitudes = [];
      data.forEach(solicitud => {
        let a = solicitud.payload.toJSON();
        a['key'] = solicitud.key;
        if (a['digitador'] == id)
          this.listaSolicitudes.push(a);
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

  actualizarArchivo(urlArchivo, id, archivoNombre) {
    const db = getDatabase();

    let objeto = {};
    objeto[archivoNombre] = urlArchivo;

    set(ref(db, 'solicitudes/' + id), objeto);
  }

}