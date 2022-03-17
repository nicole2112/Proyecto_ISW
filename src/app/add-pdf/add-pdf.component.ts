import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import Swal from 'sweetalert2';
import { AuthenticationService } from '../services/auth.services';
import { FechaService } from '../services/fecha.service';
import { PdfServices } from '../services/pdf.services';



@Component({
  selector: 'app-add-pdf-admin',
  templateUrl: './add-pdf.component.html',
  styleUrls: ['./add-pdf.component.css']
})
export class AddPdfComponent implements OnInit {

  fileList: File[];
  pdfId: string;

  fechaPdf: any;
  NombrePdf: string;

  hoy: any;
  dia:any;
  mes:any;
  anio:any;

  AreaSeleccionada: string;


  constructor(public service: AuthenticationService, public pdfService: PdfServices, public fechaService: FechaService) { }
  
  @Output() AddPDFRedirect = new EventEmitter<boolean>();

  addPDFFunc(){
    this.AddPDFRedirect.emit(true);
  }


  ngOnInit(): void {

    this.service.db.list('PDF-Programas').valueChanges().subscribe((pdfs) =>{
      let keys = Object.keys(pdfs);
      keys.forEach((item) => {
        this.pdfId = pdfs[item]['id'];
      });
    });

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
  onChange(event) {
      this.onFileChange(event.target.files);    // "target" is correct here
  }

  private onFileChange(files: File[]) {
    if(!files[0]) {
			Swal.fire({
          position: 'top-end',
          icon: 'warning',
          title: 'Debe seleccionar un archivo pdf.',
          showConfirmButton: false,
          timer: 1500
      })
			return;
		}
    this.fileList = files;
  }

  // ObtenerFecha(){
  //   this.hoy = new Date();
  //    this.dia = this.hoy.getDate();
  //    this.mes = this.hoy.getMonth() + 1;
  //    this.anio = this.hoy.getFullYear();

  //   if(this.dia < 10){
  //     this.dia ='0'+ this.dia;
  //   }

  //   if(this.mes < 10){
  //     this.mes = '0' + this.mes;
  //   }

  //  return this.hoy = this.anio + '/' + this.mes + '/' + this.dia;
  // } //2022/02/23


  AgregarPDF_Programas(pdfURL){
   this.fechaPdf = this.fechaService.ObtenerFecha();
   this.pdfService.actualizarPDF(pdfURL, this.pdfId, this.NombrePdf, this.fechaPdf);
  }

  AgregarPDF_Descargables(pdfURL){
    let PdfDescargable={};
    this.fechaPdf = this.fechaService.ObtenerFecha();
    PdfDescargable={
      "Nombre": this.NombrePdf,
      "Fecha": this.fechaPdf,
      "archivo": pdfURL
    }

    this.service.db.list('PDF-Descargables').push(PdfDescargable);
  }


  savePDF() {
    let filename = this.fileList[0].name;

    const storage = getStorage();
    const storageRef = ref(storage, filename);

    uploadBytes(storageRef, this.fileList[0]).then((snapshot) => {
    }).then(
      ()=>{
        getDownloadURL(storageRef).then(data =>{
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'PDF ha sido actualizado exitosamente!',
            showConfirmButton: false,
            timer: 1500
          })

          if(this.AreaSeleccionada === "Programas"){
            this.AgregarPDF_Programas(data);
          }else{
            this.AgregarPDF_Descargables(data);
          }

          this.addPDFFunc();
        }).catch((error)=>{

        });
      }
    );
  }


}
