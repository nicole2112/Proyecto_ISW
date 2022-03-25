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

@Component ({
    selector: 'app-view-formularios-digitador',
    templateUrl: './verFormularios.component.html',
    styleUrls: ['verFormularios.component.css']
})

export class verFormulariosComponent{

    constructor() 
{ }
    openAccordion = [];
}
