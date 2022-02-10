import { getDatabase, ref, set } from "firebase/database";

export class PdfServices{

    constructor(){}

    actualizarPDF(urlPDF,id){
        const db = getDatabase();

       set(ref(db, 'PDFS/' + id),{
           "archivo": urlPDF,
           "id" : id
       })
    }

}