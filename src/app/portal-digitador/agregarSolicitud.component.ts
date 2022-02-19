import { Component, EventEmitter, Output } from "@angular/core";
import tinymce from "tinymce";
import { BlogService } from "../services/blog.service";
import { DomSanitizer } from '@angular/platform-browser'
import { AuthenticationService } from "../services/auth.services";
import Swal from "sweetalert2";
import { AngularFireList } from "@angular/fire/compat/database";
import { Categoria } from "../models/blog";
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import { Router } from "@angular/router";


@Component({
    selector: 'app-add-Solicitud-digitador',
    templateUrl: './agregarSolicitud.component.html',
    styleUrls: ['./agregarSolicitud.component.css']
})

export class agregarSolicitudComponent{

    constructor(){ }
}