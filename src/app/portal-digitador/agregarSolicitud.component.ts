import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import { take } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { AuthenticationService } from '../services/auth.services';
import { FormsModule } from '@angular/forms';
import { SolicitudesService } from "../services/solicitudes.service";
//import { Correo } from "../services/email.service";
import {EnviarCorreo} from "../services/email.service";
import { FechaService } from "../services/fecha.service";


@Component({
    selector: 'app-add-Solicitud-digitador',
    templateUrl: './agregarSolicitud.component.html',
    styleUrls: ['./agregarSolicitud.component.css']
})

export class agregarSolicitudComponent implements OnInit{

    IDPaciente: any="";
    prioridad: any=3;
    ciudad: any=""; 
    nombre: any=""; 
    solicitud: any="";
    descripcion: any="";
    socioeconomico: any="";
    solDonacion: any="";
    hojaComp: any="";
    otros:any="";
    imgCasa1: any="";
    imgCasa2: any="";
    fileList: any[] = [];
    urlList: any[] = [];
    descList: any[] = [];
    namePattern = '^[a-zA-Z ]*$';

    static $inject = ['$http', '$q'];
    
    constructor(public service: AuthenticationService, private solicitudservice: SolicitudesService, public fechaService: FechaService) {}

    @Output() historialRedirect = new EventEmitter<boolean>();

    historialRedirectFunc(){
        this.historialRedirect.emit(true);
    }

    ngOnInit(): void {}

    onDragOver(event) {
        event.preventDefault();
    }

    // From drag and drop
    onDropSuccess(event) {
        event.preventDefault();

        this.onFileChange(event.dataTransfer.files, event.target.name);    // notice the "dataTransfer" used instead of "target"
    }

    // From attachment link
    onChange(event){
        
        this.onFileChange(event.target.files, event.target.name);    // "target" is correct here
    }

    private onFileChange(files: File[], descArchivo: string){
        if(!files[0]) {
			Swal.fire({
                position: 'top-end',
                icon: 'warning',
                title: 'Debe seleccionar el doc.',
                showConfirmButton: false,
                timer: 1500
            })
			return;
		}

        this.fileList.push(files[0]); //el problema sería al deseleccionar un archivo
        this.descList.push(descArchivo);
    }

    guardarSolicitud(){
        
        Promise.all(this.fileList.map( async (file) =>
        {
            return this.guardarArchivo(file);
        })).then((message) =>
        {
            this.descList.forEach((item, index, array) =>
                {
                    switch(item)
                    {
                        case "socioeconomico":
                            this.socioeconomico = message[index];
                            break;
                        case "solDonacion":
                            this.solDonacion = message[index];
                            break;
                        case "otros":
                            this.otros = message[index];
                            break;
                    }
                });
                
                var hoy = this.fechaService.ObtenerFecha();
                this.solicitudservice.postSolicitud(this.descripcion, this.IDPaciente,this.prioridad,"", this.solicitud, this.socioeconomico, this.solDonacion, this.otros, hoy);
                EnviarCorreo(this.IDPaciente, this.solicitud, this.descripcion);
                this.historialRedirectFunc();
                this.callSendFunction();
        });

        
    }

    async guardarArchivo(nuevoArchivo){
        return new Promise(async (resolve, reject) =>
        {
            let filename = nuevoArchivo.name;
        
            const storage = getStorage();
            const storageRef = ref(storage, filename);
        
            uploadBytes(storageRef, nuevoArchivo).then((snapshot) => {
            
            
            }).then(
            ()=>{
                getDownloadURL(storageRef).then(data =>{
                this.urlList.push(data);
                resolve(data);
                }).catch((error)=>{
                    
                });
            }
            );
        })
      }

    callSendFunction(){
        Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Solicitud enviada con éxito!',
            showConfirmButton: false,
            timer: 1500
        })
    }


}