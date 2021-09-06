import { Component, OnInit } from '@angular/core';
import { authService } from './auth/auth.service';
// import { Posts } from './posts/posts.model';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
//  storedPosts:Posts[] = [];
//  onAddedPost(post: Posts){
//    this.storedPosts.push(post);
//  }
constructor(private authservice:authService){}
ngOnInit(){
  this.authservice.Authentification();
}


}
