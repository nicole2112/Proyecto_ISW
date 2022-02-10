import { Component } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { ContactUsComponent } from "../contact-us/contact-us.component";
import { BlogService } from "../services/blog.service";
@Component({
    selector: 'home',
    templateUrl: './home.component.html',
    styleUrls: ['home.component.css']
})

export class HomeComponent {
    
    constructor(private blogService: BlogService, private _sanitizer: DomSanitizer)
    {

    }

    fullList: any[];

    ngOnInit(): void {
        this.blogService.getArticulos().subscribe((item) => {
            this.fullList = item;

        });
        

    }

    getCategorias(blog){
        let tmpArray = [];

        for (let cat in blog.categorias){
            tmpArray.push(blog.categorias[cat]);
        }

        return tmpArray;
    }


}