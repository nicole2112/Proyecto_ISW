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
        this.service.db.list('PDF-Descargables').valueChanges().subscribe((pdfs) => {
            this.pdfList = pdfs;
            
            this.pdfList.forEach((pdfs) =>
            {

                var parts =pdfs.Fecha.split('/');
                var mydate = new Date(parts[0], parts[1] - 1, parts[2]); 
                pdfs.Fecha=mydate.toLocaleString('es-ES',{ month: 'long', day:'2-digit',year:'numeric' });
                this.pdfFecha.push(pdfs);
                    
            });

            this.pdfFecha.sort((a,b) => {
                let dateA = new Date(b.Fecha), dateB = new Date(a.Fecha)
            return +dateA - +dateB;; 
            });

        });

        

    }

    

}
