import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database';
import { observable, Observable, of, from } from 'rxjs';
import { map } from 'rxjs/operators';
import Swal from 'sweetalert2'
import { AuthenticationService } from './auth.services';
import firebase from '@firebase/app-compat';
@Injectable({
  providedIn: 'root'
})
export class SolicitudesService {

  private user: firebase.default.User = null;

  blogRef: AngularFireList<any>;

  listaSolicitudes : any[];

  constructor(private db:AngularFireDatabase, private auth: AuthenticationService) { 
      
  }

  getSolicitudes(): Observable<any[]>
  {

    this.blogRef = this.db.list('solicitudes');

    return this.blogRef.snapshotChanges().pipe(map(data =>{
    this.listaSolicitudes = [];
    data.forEach(solicitud =>{
        let a = solicitud.payload.toJSON();
        a['key'] = solicitud.key;
        this.listaSolicitudes.push(a);
    })
    return this.listaSolicitudes;
    }))
  }

  postSolicitud(descripcionCaso, nombrePaciente, comentario, ciudad, queSolicita, estudioSE, archivoSolicitud, hojaCompromiso, archivoAdicional, imagen1, imagen2)
  {
    let solicitud = {
      "descripcionCaso": descripcionCaso,
      "usuario": this.user.email,
      "nombrePaciente": nombrePaciente,
      "estado": "En espera",
      "comentarios": [comentario],
      "ciudad": ciudad,
      "solicitud": queSolicita,
      "estudioSocioeconomico": estudioSE,
      "archivoSolicitud": archivoSolicitud,
      "hojaCompromiso": hojaCompromiso,
      "archivoAdicional": archivoAdicional,
      "imagen1": imagen1,
      "imagen2": imagen2,
    };
      
    this.db.list(`solicitudes`).push(solicitud).then((data) =>
    {
      solicitud["id"] = data.key;
      this.db.object(`solicitudes/${data.key}`).set(solicitud);
    });
  }
  
}