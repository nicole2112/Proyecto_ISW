import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { faFacebook } from "@fortawesome/free-brands-svg-icons";
import { faInstagramSquare } from "@fortawesome/free-brands-svg-icons";
@Component ({
    selector: 'navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['navbar.component.css']
})

export class NavbarComponent implements OnInit {
    faFacebook = faFacebook;
    faInstragram = faInstagramSquare;

    constructor(private route: ActivatedRoute) {}

    ngOnInit(): void {
        this.route.fragment.subscribe(f => {
            const element = document.querySelector("#" + f)
            if (element) element.scrollIntoView()
        })
    }
}