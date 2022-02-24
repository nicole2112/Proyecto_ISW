import { Component, OnInit } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { ActivatedRoute } from "@angular/router";
import { CollapseModule } from "angular-bootstrap-md";
import { BlogService } from "../services/blog.service";

@Component({
    selector: 'blog-post',
    templateUrl: './blog-post.component.html',
    styleUrls: ['blog-post.component.css']
})

export class BlogPostComponent implements OnInit{
    idBlog: any;
    blog: any;
    text: any;
    htmlSan: any;

    constructor(private route: ActivatedRoute, private blogService: BlogService, public sanitized: DomSanitizer){}

    ngOnInit(): void {
        this.idBlog = this.route.snapshot.params.blogId;

        this.blogService.getBlogById(this.idBlog).subscribe(blog =>{
            this.blog = blog;
        });
        

        this.htmlSan = this.blog?.contenido.replace(/<[^>]+>/g, '');

        // const { convert } = require('html-to-text');

        // this.text = convert(this.blog?.contenido, {
        // wordwrap: 130
        // });
    }

    sanitizar(html)
    {
        return this.sanitized.bypassSecurityTrustHtml(html);
    }
}