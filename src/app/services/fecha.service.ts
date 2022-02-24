import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';

@Injectable({

    providedIn:'root',
    
    })
export class FechaService{
   
    constructor(public datePipe: DatePipe){}

    ObtenerFecha(){
        let fecha = this.datePipe.transform((new Date), 'yyyy/MM/dd');
        return fecha;
    }

}