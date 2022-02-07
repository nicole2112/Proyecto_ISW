import { Component } from "@angular/core";
import tinymce from "tinymce";
import { BlogService } from "../services/blog.service";
import { DomSanitizer } from '@angular/platform-browser'

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
    newCat: any;
    public categorias = null;
    articulos: any[] = [];

    imageList: any[];

    constructor(private blogservice: BlogService, private sanitized: DomSanitizer) 
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
        labelField: 'label',
        valueField: 'value',
        maxItems: 10,
        highlight: true,
        create: false,
    };
    
    //datos de prueba
    data = [
        {
            label: 'Medicina',
            value: 'Medicina'
        },
            {
            label: 'Eventos',
            value: 'Eventos'
        },
            {
            label: 'Donaciones',
            value: 'Donaciones'
        }
    ]

    ngOnInit()
    {

        this.blogservice.getArticulos().subscribe((item) => {
       
            this.articulos = item;
        });
    }

    public changed() { //cada vez que se modifica input de categorías seleccionadas
        console.log(this.categorias);
    }

    agregarCategoria()
    {
        const item = {
            label: this.newCat,
            value: this.newCat
        };

        this.data.push(item);
        this.newCat = null;
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