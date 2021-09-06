import { Component, OnDestroy, OnInit } from "@angular/core";
import { PageEvent } from "@angular/material/paginator";
import { Subscription } from "rxjs";
import { authService } from "src/app/auth/auth.service";
import { Posts } from "../posts.model";
import { PostService } from "../posts.service";


@Component({
  selector: 'app-post-list',
  templateUrl: './postlist.component.html',
  styleUrls: ['./postlist.component.css']
})

export class PostListComponent implements OnInit, OnDestroy {
  // posts = [
  //   {
  //     title:'First post', content:'this is conetne'
  //   },
  //   {
  //     title:'second post', content:'this is conetne'
  //   },
  //   {
  //     title:'third post', content:'this is conetne'
  //   }
  // ];

  posts: Posts[] = [];
  isLoading = false;
  postLength = 0;
  sizeOfPost = 1; // no. of post per page
  currentPage = 1;
  sizeOption = [1,3,5,8];
  userid :string="";
  isUserAuthenticate = false;
  private postSub: Subscription = new Subscription;
  private authListner:Subscription = new Subscription;
  constructor(public postsService: PostService, private authservice:authService) { }
  ngOnInit() {
    this.isLoading = true;
    this.userid = this.authservice.getUserId();
    this.postsService.getPost(this.sizeOfPost,this.currentPage);
    this.postSub = this.postsService.getPostUpdated()
    .subscribe((posts: {posts:Posts[],postCount:number}) => {
      this.isLoading = false;
      this.postLength = posts.postCount;
      this.posts = posts.posts;
    });
    this.isUserAuthenticate = this.authservice.userAuthStatus();
    this.authservice.isUserAuth().subscribe(userAuth=>{
       this.isUserAuthenticate = userAuth;
       this.userid = this.authservice.getUserId();
    });

  }
  DeletePost(postid: string) {
    this.isLoading=true;
    this.postsService.deletePost(postid).subscribe(()=>{
      this.postsService.getPost(this.sizeOfPost,this.currentPage);
    },()=>{
      this.isLoading = false;
    });
  }
  onPageClick(pageEvent:PageEvent){
    this.isLoading  = true;
    console.log(pageEvent);
    this.currentPage = pageEvent.pageIndex+1;
    this.sizeOfPost = pageEvent.pageSize;
    this.postsService.getPost(this.sizeOfPost,this.currentPage );
  }
  ngOnDestroy() {
    this.postSub.unsubscribe();
    this.authListner.unsubscribe();
  }

}
