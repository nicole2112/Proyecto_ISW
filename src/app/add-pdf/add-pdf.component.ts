import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import Swal from 'sweetalert2';
import { AuthenticationService } from '../services/auth.services';
import { PdfServices } from '../services/pdf.services';



@Component({
  selector: 'app-add-pdf',
  templateUrl: './add-pdf.component.html',
  styleUrls: ['./add-pdf.component.css']
})
export class AddPdfComponent implements OnInit {

  fileList: File[];
  pdfId: string;

  fechaPdf: any;
  NombrePdf: string;

  AreaSeleccionada: string;


  constructor(public service: AuthenticationService, public pdfService: PdfServices) { }
  
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
    this.fileList = files;
    console.log(files[0].name);
  }


  AgregarPDF_Programas(pdfURL){
   this.fechaPdf = new Date().toLocaleDateString();
   this.pdfService.actualizarPDF(pdfURL, this.pdfId, this.NombrePdf, this.fechaPdf);
  }

  AgregarPDF_Descargables(pdfURL){
    let PdfDescargable={};
    this.fechaPdf = new Date().toLocaleDateString();
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
