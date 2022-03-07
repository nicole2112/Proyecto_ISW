import { Component } from "@angular/core";
import {render} from 'creditcardpayments/creditCardPayments';
import Swal from 'sweetalert2';

@Component({
    selector: 'paypal',
    templateUrl: './paypal.component.html'
})

export class PayPalComponent{

    ngOnInit(){
        render(
            {
                id: "#myPaypalButtons",
                currency: "USD",
                value: "100.00",
                onApprove: this.callApprovedFunction
            }
        );
    }

    callApprovedFunction() {
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Transacción exitosa',
          showConfirmButton: false,
          timer: 1500,
        });
    }
}