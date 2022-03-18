import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database';
import { observable, Observable, of, from } from 'rxjs';
import { concatMap, map, take } from 'rxjs/operators';
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


  listaSolicitudesPaciente:any[] =[];

  constructor(private db: AngularFireDatabase, private auth: AuthenticationService, private pacienteService: PacientesService) {

  }

  getTodasSolicitudes(id): Observable<any[]> {

    this.refer = this.db.list('pacientes');
    this.listaSolicitudes = [];
    return this.refer.snapshotChanges().pipe(map(data => {
      this.listaSolicitudes = [];

      data.forEach( paciente => {
        let a = paciente.payload.toJSON();

        if(a['Solicitudes'] !== undefined)
        {
          let Solicitudes = a['Solicitudes'];
          let pacienteSinSol = a;
          pacienteSinSol['pacienteEstado'] = pacienteSinSol['estado'];
          pacienteSinSol['IDPaciente'] = pacienteSinSol['id'];
          pacienteSinSol['nombrePaciente'] = pacienteSinSol['nombre'];
          delete pacienteSinSol['Solicitudes'];
          delete pacienteSinSol['estado'];
          delete pacienteSinSol['nombre'];
          delete pacienteSinSol['id'];
          Object.keys(Solicitudes).forEach(key =>
            {
              let solicitud = Solicitudes[key];
              solicitud['solicitudKey'] = key;
              if (solicitud['digitador'] == id || id == "ZQjKhXkpXPZJQ5UbT14JsFE8rvu2")
              {
                solicitud['pacienteKey'] = paciente.key;

                let sol = {...pacienteSinSol, ...solicitud};
                sol['rawSolicitud'] = solicitud;

                this.listaSolicitudes.push(sol);
              }
            });
        }
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

  getSolicitud(idPaciente): Observable<any> {
    this.refer = this.db.list('pacientes');

    return this.refer.valueChanges().pipe(map(pacientes =>{
      this.listaSolicitudesPaciente=[];
      let keys = Object.keys(pacientes);

      keys.forEach((pac)=>{
        if(pacientes[pac]['id'] == idPaciente){
          this.listaSolicitudesPaciente = pacientes[pac]['Solicitudes'];
        }
      })
      return this.listaSolicitudesPaciente;
    }))
  }

  archivarSolicitud(idPaciente: any, idSolicitud: string, keyPaciente: any, archivado: number) {
    let datos;
    this.getSolicitud(idPaciente).pipe(take(1)).subscribe( solicitud =>
      {
        let keys = Object.keys(solicitud);
        keys.forEach(item =>{
          if(item == idSolicitud){
             datos ={
               "archivado": archivado
             }
          }
        })
        this.db.object(`pacientes/${keyPaciente}/Solicitudes/${idSolicitud}`).update(datos);
      });
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

    this.db.list(`pacientes/${IDPaciente}/Solicitudes`).push(solicitud).then((data) => {
      solicitud["id"] = data.key;
      this.db.object(`pacientes/${IDPaciente}/Solicitudes/${data.key}`).set(solicitud);
    });
  }

  async editarSolicitud(idPaciente, idSolicitud, solicitud, descripcionCaso, estado, archivado, prioridad, queSolicita, estudioSE, archivoSolicitud, archivoAdicional) {

    solicitud["descripcion"]= descripcionCaso;
    solicitud["estado"]= estado;
    solicitud["prioridad"]= prioridad;
    solicitud["queSolicita"]= queSolicita;
    solicitud["estudioSE"]= estudioSE;
    solicitud["solicitudDonacion"]= archivoSolicitud;
    solicitud["otros"]= archivoAdicional;
    solicitud["archivado"]= archivado;

    await this.db.object(`pacientes/${idPaciente}/Solicitudes/${idSolicitud}`).set(solicitud).then(algo => {return algo});
    return "Solicitud editada";
  }


  actualizarArchivo(urlArchivo, id, archivoNombre) {
    const db = getDatabase();

    let objeto = {};
    objeto[archivoNombre] = urlArchivo;

    set(ref(db, 'solicitudes/' + id), objeto);
  }


  editarSolicitudPresidencia(idPaciente, idSolicitud, solicitud, estado, comentariosPresidencia) {
    solicitud['estado'] = estado;
    solicitud['comentariosPresidencia'] = comentariosPresidencia;
    this.db.object(`pacientes/${idPaciente}/Solicitudes/${idSolicitud}`).set(solicitud).then(algo => console.log(algo));
  }

}
