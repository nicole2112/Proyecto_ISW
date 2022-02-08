import { Component, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2'
import { AngularFireDatabase, AngularFireList, AngularFireObject } from '@angular/fire/compat/database';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import { BlogService } from '../services/blog.service';
import { Blog } from '../models/blog';
import { StringLike } from '@firebase/util';
import { runInThisContext } from 'vm';

@Component ({
    selector: 'app-view-articulos-admin',
    templateUrl: './verArticulos.component.html',
    styleUrls: ['verArticulos.component.css']
})


export class verArticulosComponent {

  contenido:any;
  fechaCreacion: any;
  idArticulo: any;
  imageUrl: any;
  resumen: any;
  titulo: any;

  fileList: any[];


  articuloSelectedId: string;
  articuloSelectedImg: string;
  articuloSelectedName: string;
  articuloSelectedDescription: string;
  articuloSelectedfecha: any;
  articuloSelectedCategorias: any;

  Blog =[];
  closeResult: string;
  selectedValue: any;
  imgUrlSave: any;


  constructor(public blogService: BlogService, private db: AngularFireDatabase, private modalService: NgbModal) {}

  FundacionRef: AngularFireList<any>;
  articuloRef: AngularFireObject<any>;

  arrCategorias: any


  ngOnInit(): void {

    this.FundacionRef = this.db.list('blogs');

    this.FundacionRef.snapshotChanges().subscribe(data =>{
      this.Blog = [];
      data.forEach(articulo =>{
        let a = articulo.payload.toJSON();
        a['$key'] = articulo.key;
        //console.log(a['categorias']);
        this.arrCategorias = a['categorias'];
        a['categorias'] = "";
        for(var categoria in this.arrCategorias){
          if(this.arrCategorias.hasOwnProperty(categoria)) {
            console.log(this.arrCategorias[categoria]);
            a['categorias'] += this.arrCategorias[categoria] + " ";
          }
        }
        this.Blog.push(a as Blog);
      })
    })
  }

  open(content, id: string, name: string, descripcion: string, fecha: Date, categorias: any){
    this.articuloSelectedId = id;
    this.articuloSelectedName = name;
    this.articuloSelectedDescription = descripcion;
    this.articuloSelectedfecha = fecha;
    this.articuloSelectedCategorias = categorias;

    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result)=>{
      console.log(`Closed with: ${result}`);
    }, (reason)=>{
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`
    })
  }

  onSelect(selectedItem: any, img: string){
    this.articuloSelectedImg = selectedItem.imageUrl;
    document.getElementById("titulo").setAttribute('value', selectedItem.titulo);
    document.getElementById("contenido").innerHTML = selectedItem.contenido;
    document.getElementById("descripcion").innerHTML = selectedItem.descripcion;
    document.getElementById("fechaCreacion").setAttribute('value', selectedItem.fechaCreacion);
  }

  deleteArticulo(){
    this.articuloRef = this.db.object('blogs/' + this.articuloSelectedId);
    this.articuloRef.remove();
    this.callDeleteNotification();
  }

  onDeleteConfirmation(name: string){
    document.getElementById("nameDelete").setAttribute('value', name);
  }

  onDragOver(event) {
    event.preventDefault();
  }

  // From drag and drop
  onDropSuccess(event) {
      event.preventDefault();

      this.onFileChange(event.dataTransfer.files);    // notice the "dataTransfer" used instead of "target"
  }

  // From attachment link
  onChangeFile(event) {
      this.onFileChange(event.target.files);    // "target" is correct here
  }

  private onFileChange(files: File[]) {
    this.fileList = files;
  }


  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  callUpdateNotification(){
    Swal.fire({
      position: 'top-end',
      icon: 'success',
      title: 'Héroe ha sido actualizado exitosamente!',
      showConfirmButton: false,
      timer: 1500
    })
  }

  callDeleteNotification(){
    Swal.fire({
      position: 'top-end',
      icon: 'success',
      title: 'Héroe ha sido eliminado exitosamente!',
      showConfirmButton: false,
      timer: 1500
    })
  }

  writeArticleData(imageUrl, articuloSelectedId){
    let articuloItem={};
    const userRef = this.db.object('blogs/' + articuloSelectedId);

    articuloItem={
      "contenido": this.contenido,
      "fechaCreacion": this.fechaCreacion,
      "titulo": this.titulo
    }

    userRef.update(articuloItem)
    this.callUpdateNotification();
  }

  getValues(){
    var tituloVal = document.getElementById('titulo') as HTMLInputElement;
    var contenidoVal = document.getElementById('contenido') as HTMLTextAreaElement;
    var fechaCreacionVal = document.getElementById('fechaCreacion') as HTMLInputElement;

    let tituloValue = tituloVal.value;
    let contenidoValue = contenidoVal.value;
    let fechaCreacionValue = fechaCreacionVal.value;

    this.titulo = tituloValue;
    this.contenido =  contenidoValue;
    this.fechaCreacion = fechaCreacionValue;

  }

  saveArticulo() {
    this.getValues();
    if(this.fileList != undefined  && this.fileList.length > 0)
    {
    let filename = this.fileList[0].name;
    const storage = getStorage();
    const storageRef = ref(storage, filename);
    
    
      uploadBytes(storageRef, this.fileList[0]).then((snapshot) => {

      }).then(
         ()=>{
          getDownloadURL(storageRef).then(data =>{
            this.writeArticleData(data, this.articuloSelectedId) 
          }).catch((error)=>{
            console.log(error)
          });
        }
      );
    }else{
      this.writeArticleData(this.articuloSelectedImg, this.articuloSelectedId)
    }
  }  
    
}
