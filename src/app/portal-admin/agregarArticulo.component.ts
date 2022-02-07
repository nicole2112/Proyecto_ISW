import { Component } from "@angular/core";
import tinymce from "tinymce";
import { BlogService } from "../services/blog.service";
import { DomSanitizer } from '@angular/platform-browser'
import { AuthenticationService } from "../services/auth.services";
import Swal from "sweetalert2";
import { AngularFireList } from "@angular/fire/compat/database";
import { Categoria } from "../models/blog";

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

    imageList: any[];


    //nuevo
    categorias: any;
    nombreCategoria: string;
    categoriasList = [];
    

    constructor(private blogservice: BlogService, private sanitized: DomSanitizer, public service: AuthenticationService) 
    { }

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
        console.log(this.categoriasList);
    }

    getCategorias(){
        this.categoriaRef = this.service.db.list('categorias');

        this.categoriaRef.snapshotChanges().subscribe(data =>{
            this.categoriasList = [];
            data.forEach(articulo =>{
                let a = articulo.payload.toJSON();
                a['$key'] = articulo.key;
                this.categoriasList.push(a as Categoria);
            })
            console.log(this.categoriasList);
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
        this.imageList = files;
        console.log(files[0]?.name);
    }

    saveArticle(){
        this.blogservice.postArticulo(this.titulo, this.getContenidoTiny(), "url",this.descripcion, this.fecha);
    }

}