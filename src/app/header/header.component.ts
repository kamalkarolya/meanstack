import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { authService } from "../auth/auth.service";

@Component({
 selector:'app-header',
 templateUrl:'./header.component.html',
 styleUrls:['./header.component.css']
})

export class HeaderComponent implements OnInit , OnDestroy {
   constructor(private authservice:authService ){}
   isUserAuth = false;
   private authListner !: Subscription;
  ngOnInit() {
    this.isUserAuth= this.authservice.userAuthStatus();
   this.authListner = this.authservice.isUserAuth()
      .subscribe(userAuth => {
          this.isUserAuth = userAuth;
      });

  }
  onLogout(){
    this.authservice.logout();
  }
  ngOnDestroy() {
    this.authListner.unsubscribe();
   }

}
