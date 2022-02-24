import {DatePipe} from '@angular/common'

export class FechaService{
   
    constructor(private datePipe: DatePipe){}

    ObtenerFecha(){
        let fecha = this.datePipe.transform((new Date), 'yyyy/MM/dd');
        return fecha;
    }

}