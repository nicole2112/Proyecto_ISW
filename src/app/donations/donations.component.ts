
import { Component} from "@angular/core";
import { ModalDismissReasons, NgbModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
    selector: 'donations',
    templateUrl: './donations.component.html',
    styleUrls: ['./donations.component.css']
})

export class DonationsComponent{

    constructor(private modalService: NgbModal) {}

    closeResult: string;

    goToUrl(): void {
        window.open('https://www.gofundme.com/', "_blank");
    }

    open(content) {
        this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
          console.log(`Closed with: ${result}`);
        }, (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        });
      }

      private getDismissReason(reason: any): string {
        if (reason === ModalDismissReasons.ESC) {
          return 'by pressing ESC';
        } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
          return 'by clicking on a backdrop';
        } else {
          return `with: ${reason}`;
        }
      }
}