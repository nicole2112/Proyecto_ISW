import { Component, OnInit } from '@angular/core';
import { AngularFireList } from '@angular/fire/compat/database';
import { Descargables, Programas } from '../models/pdf';
import { AuthenticationService } from '../services/auth.services';

@Component({
  selector: 'app-view-pdfs',
  templateUrl: './view-pdfs.component.html',
  styleUrls: ['./view-pdfs.component.css']
})
export class ViewPdfsComponent implements OnInit {

  PdfDescargables = [];
  PdfProgramas = [];

  constructor(public service: AuthenticationService) { }

  PDF_DescargablesRef: AngularFireList<any>;
  PDF_ProgramasRef: AngularFireList<any>;

  ngOnInit(): void {
    //leer base de datos PDF-Descargables
    this.PDF_DescargablesRef = this.service.db.list('PDF-Descargables');
    this.PDF_DescargablesRef.snapshotChanges().subscribe(data =>{
      this.PdfDescargables = [];
      data.forEach(pdf =>{
        let a = pdf.payload.toJSON();
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
        b['$key'] = pdf.key;
        this.PdfProgramas.push(b as Programas)
      })
    })

  }

}
