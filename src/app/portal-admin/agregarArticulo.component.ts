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
    selector: 'app-add-articulo-admin',
    templateUrl: './agregarArticulo.component.html',
    styleUrls: ['./agregarArticulo.component.css']
})

export class AgregarArticuloComponent{

    titulo: any;
    descripcion: any;
    fecha: any;
    contenido: any;
    articulos: any[] = [];
    imageUrl:any;

    imageList: any[];

    urlI:any; //para mostrar imagen al seleccionarla

    //nuevo
    categorias: any;
    nombreCategoria: string;
    categoriasList: any[];

    catListLocal: any[];
    

    constructor(private blogservice: BlogService, private sanitized: DomSanitizer, public service: AuthenticationService, private router: Router) 
    { }

    @Output() viewArticulosRedirect = new EventEmitter<boolean>();

    viewArticulosRedirectFunc() {
        this.viewArticulosRedirect.emit(true);
    }

    getContenidoTiny()
    {
        return tinymce.get("contenido").getContent();
    }

    //Permite desplegar el codigo html tomado de la base de datos
    sanitizar(html)
    {
        return this.sanitized.bypassSecurityTrustHtml(html);
    }

    onSubmit()
    {
        
    }

    config = {
        labelField: 'Categoria',
        valueField: 'Categoria',
        maxItems: 10,
        highlight: true,
        create: false,
    };
    


    categoriaRef: AngularFireList<any>;



    ngOnInit()
    {

        this.blogservice.getArticulos().subscribe((item) => {
       
            this.articulos = item;
        });

        this.getCategorias();
    }

    public changed() { //cada vez que se modifica input de categorías seleccionadas
    }


     removeDuplicates(arr) {
        return [...new Set(arr)];
    }

    getCategorias(){
        this.categoriasList =[];

        
        this.categoriaRef = this.service.db.list('categorias');
        this.categoriaRef.snapshotChanges().subscribe(data =>{
            data.forEach(articulo =>{
                let a = articulo.payload.toJSON();
                a['$key'] = articulo.key;
                this.categoriasList.push(a as Categoria);
            })

        })
    }

    agregarCategoria()
    {
        let categoriaItem={};

        categoriaItem={
            "Categoria": this.nombreCategoria
        }
        this.service.db.list('categorias').push(categoriaItem);
        this.callNuevaCategoriaAgregada();
        this.nombreCategoria = "";
    }

    callNuevaCategoriaAgregada(){
        Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Nueva Categoria agregada',
            showConfirmButton: false,
            timer: 1500
          })
    }

    //Para adjuntar imagen principal
    onDragOver(event) {
        event.preventDefault();
    }
    // From drag and drop
    onDropSuccess(event) {
          event.preventDefault();
    
          this.onFileChange(event.dataTransfer.files);    // notice the "dataTransfer" used instead of "target"
    }
    // From attachment link
    onChange(event) {
        this.onFileChange(event.target.files);    // "target" is correct here
    }
    private onFileChange(files: File[]) {
        if(!files[0]) {
			Swal.fire({
                position: 'top-end',
                icon: 'warning',
                title: 'Debe seleccionar una imagen de portada.',
                showConfirmButton: false,
                timer: 1500
            })
            this.urlI = null;
			return;
		}

        this.imageList = files;

        //for displaying image in form
        var reader = new FileReader();
		reader.readAsDataURL(files[0]);
		
		reader.onload = (_event) => {
			this.urlI = reader.result; 
		}
    }

    saveArticle(){
        let filename = this.imageList[0].name;
        
        const storage = getStorage();
        const storageRef = ref(storage, filename);

        uploadBytes(storageRef, this.imageList[0]).then((snapshot) => {
        
        
        }).then(
        ()=>{
            getDownloadURL(storageRef).then(data =>{
                this.blogservice.postArticulo(this.titulo, this.getContenidoTiny(), data,this.descripcion, this.fecha, this.categorias);

                Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    title: 'El artículo ha sido agregado al blog.',
                    showConfirmButton: false,
                    timer: 1500
                })
            
                this.viewArticulosRedirectFunc();
            }).catch((error)=>{
                console.log(error);
            });
        }
        );
    }

}