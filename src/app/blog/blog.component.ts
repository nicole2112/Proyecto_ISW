
import { Component } from "@angular/core";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
import { BlogService } from "../services/blog.service";

@Component({
    selector: 'blog',
    templateUrl: './blog.component.html',
    styleUrls: ['./blog.component.css']
})

export class BlogComponent{

    constructor(private blogService: BlogService, private _sanitizer: DomSanitizer)
    {

    }

    fullList: any[];

    ngOnInit(): void {
        this.blogService.getArticulos().subscribe((item) => {
            this.fullList = item;

        });
        

    }

    inputPic(url:string):SafeResourceUrl{
        return this._sanitizer.bypassSecurityTrustResourceUrl(url);
      }
}