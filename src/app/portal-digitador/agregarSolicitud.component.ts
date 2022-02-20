import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import { take } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { AuthenticationService } from '../services/auth.services';
import { FormsModule } from '@angular/forms';


@Component({
    selector: 'app-add-Solicitud-digitador',
    templateUrl: './agregarSolicitud.component.html',
    styleUrls: ['./agregarSolicitud.component.css']
})

export class agregarSolicitudComponent implements OnInit{

    nombre: any;
    ciudad: any; 
    solicitud: any;
    descripcion: any;
    socioeconomico: any;
    solDonacion: any;
    hojaComp: any;
    otros:any;
    imgCasa1: any;
    imgCasa2: any;
    fileList: any[] = [];
    namePattern = '^[a-zA-Z ]*$';

    constructor(public service: AuthenticationService) {}

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

        this.onFileChange(event.dataTransfer.files);    // notice the "dataTransfer" used instead of "target"
    }

    // From attachment link
    onChange(event){
        this.onFileChange(event.target.files);    // "target" is correct here
    }

    private onFileChange(files: File[]){
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
        console.log(files[0]?.name);
        console.log(files[1]?.name);

        console.log(this.fileList);
    }

    guardarSolicitud(){
        this.historialRedirectFunc();
    }
}