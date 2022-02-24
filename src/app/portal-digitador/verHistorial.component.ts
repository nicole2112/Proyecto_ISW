import { Component, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2'
import { AngularFireDatabase, AngularFireList, AngularFireObject } from '@angular/fire/compat/database';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import { BlogService } from '../services/blog.service';
import { Blog } from '../models/blog';
import tinymce from "tinymce";
import { StringLike } from '@firebase/util';
import { runInThisContext } from 'vm';
import { AuthenticationService } from "../services/auth.services";
import { Categoria } from "../models/blog";
import { ThrowStmt } from '@angular/compiler';
import { SolicitudesService } from '../services/solicitudes.service';

@Component({
    selector: 'app-view-Historial-admin',
    templateUrl: './verHistorial.component.html',
    styleUrls: ['verHistorial.component.css']
})

export class verHistorialComponent implements OnInit {
    recordsList: any;
    recordList = [];
    filteredRecordList = [];
    states = [
        'En espera',
        'Aprobada',
        'Denegada',
    ];

    constructor(private service: AuthenticationService, private recordService: SolicitudesService) { }

    ngOnInit() {
        this.recordService.getSolicitudes(this.service.userDetails.uid).subscribe(records => {
            this.recordList = records.sort((a, b) => {
                let dateA = new Date(b.fecha), dateB = new Date(a.fecha)
                return +dateA - +dateB;
            });
            this.filteredRecordList = this.recordList;
        });
    }

    onSelectedChange(event:any){
        const state = event.target.value;
        if (state == "Todos") {
            this.filteredRecordList = this.recordList;
        } else {
            this.filteredRecordList = this.recordList.filter(record => {
                return record.estado == state;
            });
        }
    }
}
