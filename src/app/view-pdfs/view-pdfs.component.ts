import { Component, OnInit } from '@angular/core';
import { Descargables, Programas } from '../models/pdf';
import { AuthenticationService } from '../services/auth.services';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from '@angular/fire/compat/database';
import { PdfServices } from '../services/pdf.services';
import Swal from 'sweetalert2';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-view-pdfs-admin',
  templateUrl: './view-pdfs.component.html',
  styleUrls: ['./view-pdfs.component.css'],
  providers: [DatePipe]
})
export class ViewPdfsComponent implements OnInit {

  PdfDescargables = [];
  PdfProgramas = [];
  closeResult: string;
  fileList: any[];

  PDFRef: AngularFireObject<any>;

  nombre: any;
  fechaActual: any;
  constructor(public service: AuthenticationService, private modalService: NgbModal, private db: AngularFireDatabase, public pdfService: PdfServices, private datePipe: DatePipe) {
    let fecha = this.datePipe.transform((new Date), 'yyyy/MM/dd');
    this.fechaActual = fecha;
  }

  PDF_DescargablesRef: AngularFireList<any>;
  PDF_ProgramasRef: AngularFireList<any>;

  pdfSelectedId: any;
  pdfSelectedNombre: any;
  pdfSelectedFecha: any;
  pdfSelectedArchivo: any;

  pdfSelectedType: string;

  ngOnInit(): void {
    //leer base de datos PDF-Descargables
    this.PDF_DescargablesRef = this.service.db.list('PDF-Descargables');
    this.PDF_DescargablesRef.snapshotChanges().subscribe(data =>{
      this.PdfDescargables = [];
      data.forEach(pdf =>{
        let a = pdf.payload.toJSON();
        console.log(a);
        a['$key'] = pdf.key;
        this.PdfDescargables.push(a as Descargables)
      })
    })

    //leer base de datos PDF-Programas
    this.PDF_ProgramasRef = this.service.db.list('PDF-Programas');
    this.PDF_ProgramasRef.snapshotChanges().subscribe(data =>{
      this.PdfProgramas = [];
      data.forEach(pdf =>{
        let b = pdf.payload.toJSON();
        console.log(b);
        b['$key'] = pdf.key;
        this.PdfProgramas.push(b as Programas)
      })
    })

  }

  open(content, id:string , nombre: string, fecha: Date, archivo: any, tipo: string){
    this.pdfSelectedId = id
    this.pdfSelectedNombre = nombre;
    this.pdfSelectedFecha = fecha;
    this.pdfSelectedArchivo = archivo;
    this.pdfSelectedType = tipo;

    console.log(this.pdfSelectedId + ' ' + this.pdfSelectedNombre);

    console.log('Type: ' + this.pdfSelectedType);
    // console.log(this.fechaActual);

    this.modalService.open(content, {backdrop: 'static', ariaLabelledBy: 'modal-basic-title'}).result.then((result)=>{
      console.log(`Closed with: ${result}`);
    }, (reason)=>{
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`
    })
  }

  writePDFData(archivo, pdfSelectedId){
    let PDFItem={};
    const PDFRef = this.db.object('PDF-Descargables/' + pdfSelectedId);

    PDFItem={
      "Nombre": this.nombre,
      "archivo": archivo,
      "Fecha": this.fechaActual
    }

    PDFRef.update(PDFItem)
    this.callUpdateNotification();
    this.fileList = [];
  }

  getValues(){
    var tituloVal = document.getElementById('titulo') as HTMLInputElement;


    let tituloValue = tituloVal.value;

    this.nombre = tituloValue;
  }

  savePDF() {
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
            // console.log("aca 11");
            if(this.pdfSelectedType === 'descargable'){
              // console.log("aca");
              this.writePDFData(data, this.pdfSelectedId)
            }else{
              // console.log("aca 2");
              // console.log(this.pdfSelectedNombre);
              this.AgregarPDF_Programas(data);
            }
          }).catch((error)=>{
            console.log(error)
          });
        }
      );
    }else{
      if(this.pdfSelectedType === 'descargable'){
        // console.log("Leo2")
        this.writePDFData(this.pdfSelectedArchivo ,this.pdfSelectedId)
      } else {
        // console.log("Leo")
        // console.log(this.pdfSelectedNombre)
        this.AgregarPDF_Programas(this.pdfSelectedArchivo);
      }
    }
  }

  AgregarPDF_Programas(pdfURL){
    this.pdfSelectedFecha = new Date().toLocaleDateString();
    this.pdfService.actualizarPDF(pdfURL, this.pdfSelectedId, this.nombre, this.fechaActual);
    this.callUpdateNotification();
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

  onSelect(selectedItem: any, img: string){
    document.getElementById("titulo").setAttribute('value', selectedItem.Nombre);
    // document.getElementById("fechaCreacion").setAttribute('value', selectedItem.Fecha);
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

  // deletePDF(){
  //   this.pdfService.deleteArticulo(this.articuloSelectedId);
  //   this.callDeleteNotification();
  // }

  deletePDF(){
    this.PDFRef = this.db.object('PDF-Descargables/' + this.pdfSelectedId);
    this.PDFRef.remove();
    this.callDeleteNotification();
  }

  onDeleteConfirmation(name: string){
    document.getElementById("nameDelete").setAttribute('value', name);
  }

  private onFileChange(files: File[]) {
    this.fileList = files;
  }

  callUpdateNotification(){
    Swal.fire({
      position: 'top-end',
      icon: 'success',
      title: 'PDF ha sido actualizado exitosamente!',
      showConfirmButton: false,
      timer: 1500
    })
  }

  callDeleteNotification(){
    Swal.fire({
      position: 'top-end',
      icon: 'success',
      title: 'PDF ha sido eliminado exitosamente!',
      showConfirmButton: false,
      timer: 1500
    })
  }
}
