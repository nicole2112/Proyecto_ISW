 import { getDatabase, ref, set } from "firebase/database";
import { AuthenticationService } from "./auth.services";

export class PdfServices{

    constructor(){}

    actualizarPDF(urlPDF, id, NombrePdf, fechaPdf){
        const db = getDatabase();

       set(ref(db, 'PDF-Programas/' + id),{
           "Nombre": NombrePdf,
           "Fecha" : fechaPdf,
           "archivo": urlPDF,
           "id" : id
       })
    }
}