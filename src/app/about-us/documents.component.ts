import { Component, OnInit } from "@angular/core";
import { AuthenticationService } from "../services/auth.services";

@Component({
    selector: 'documents-page',
    templateUrl: './documents.component.html', 
    styleUrls: ['documents.component.css']
})

export class DocumentsComponent {

    archivo:any;
    pdfList: any;
    pdfFecha=[];
    openAccordion = [];
    
    

    constructor(private service: AuthenticationService){}

    ngOnInit(): void {
        this.service.db.list('PDF-Descargables').valueChanges().subscribe((pdfs:any) => {
            this.pdfFecha = pdfs.sort((a,b) => {
                let dateA = new Date(b.Fecha), dateB = new Date(a.Fecha)
            return +dateA - +dateB;; 
            });
        });
    }
}
