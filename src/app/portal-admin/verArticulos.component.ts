import { Component, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2'
import { AngularFireDatabase, AngularFireList, AngularFireObject } from '@angular/fire/compat/database';
import { BlogService } from '../services/blog.service';
import { Blog } from '../models/blog';

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
  artiuloSelectedName: string;
  Blog =[];
  closeResult: string;
  selectedValue: any;
  imgUrlSave: any;


  constructor(public blogService: BlogService, private db: AngularFireDatabase, private modalService: NgbModal) {}

  FundacionRef: AngularFireList<any>;
  articuloRef: AngularFireObject<any>;


  ngOnInit(): void {

    this.FundacionRef = this.db.list('blogs');

    this.FundacionRef.snapshotChanges().subscribe(data =>{
      this.Blog = [];
      data.forEach(articulo =>{
        let a = articulo.payload.toJSON();
        a['$key'] = articulo.key;
        this.Blog.push(a as Blog);
      })
    })
  }

  open(content, id: string, name: string){
    this.articuloSelectedId = id;
    this.artiuloSelectedName = name;

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
  }

  deleteArticulo(){
    this.articuloRef = this.db.object('blogs/' + this.articuloSelectedId);
    this.articuloRef.remove();
    this.callDeleteNotification();
  }

  onDeleteConfirmation(name: string){
    document.getElementById("nameDelete").setAttribute('value', name);
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
    
}
