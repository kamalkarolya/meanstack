import { Injectable } from "@angular/core";
import { AuthData } from "./auth.model";
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs";
import { Router } from "@angular/router";

import { environment } from "src/environments/environment";
const BACKEND_URL = environment.apiUrl + "user/";
@Injectable({ providedIn: "root" })

export class authService {
   private token : string = "";
   private authStatus = new Subject<boolean>();
   private tokenTime :any;
   private userId : string="";
   isUserAuthenticate =false;
  constructor(private http: HttpClient,private router : Router) { }

  isUserAuth(){
    return this.authStatus.asObservable();
  }
  userAuthStatus(){
    return this.isUserAuthenticate;
  }
  getUserId(){
    return this.userId;
  }
  getToken(){
    return this.token;
  }

  newUser(user: AuthData) {
    const authUser: AuthData = {
      fname: user.fname,
      phone: user.phone,
      occupation: user.occupation,
      email: user.email,
      password: user.password
    };
    this.http.post(BACKEND_URL+'signup',authUser)
      .subscribe(() => {
        this.router.navigate(["/login"]);
      },error=>{
        this.authStatus.next(false);
      });
  }

  login(email:string,password:string){

    const authUser = {email:email,password:password };
    this.http.post<{token:string,userId:string,expiresIn:number}>(BACKEND_URL+"login",authUser)
    .subscribe(response=>{
      //  console.log(response);
      const token = response.token;
      this.token = token;
      if(token){
        const tokenDuration = response.expiresIn;
        this.AuthTimer(tokenDuration);
        this.userId = response.userId;
        this.isUserAuthenticate = true;
        this.authStatus.next(true);
        const now = new Date();
        const expiresIn = new Date(now.getTime() + tokenDuration*1000 );
        console.log(expiresIn);

        this.AuthSaveData(token,expiresIn,this.userId);
        this.router.navigate(["/"]);
      }
    },error=>{
      this.authStatus.next(false);
    });
  }

  logout(){
    this.token ="null";
    this.userId = "null";
    this.isUserAuthenticate = false;
    this.authStatus.next(false);
    clearTimeout(this.tokenTime);
    this.AuthClearData();
    this.router.navigate(["/login"]);
  }
  Authentification(){
    const authData = this.getAuthData();
    if(!authData){
      return;
    }
    const now = new Date();
    const check = authData.expire.getTime() - now.getTime();
    if(check>0){
      this.token = authData.token;
      this.userId = authData.userid;
      this.authStatus.next(true);
      this.isUserAuthenticate = true;
      // this.tokenTime = authData.expire;
      this.AuthTimer(check/1000);
    }
  }

  private AuthTimer(duration:number){
    this.tokenTime = setTimeout(()=>{
      this.logout();
  },duration*1000);
  }
  private AuthSaveData(token:string,expire:Date,userid:string){
    localStorage.setItem('token',token);
    localStorage.setItem('expire',expire.toISOString());
    localStorage.setItem('userid',userid);

  }

  private AuthClearData(){
    localStorage.removeItem("token");
    localStorage.removeItem("expire");
    localStorage.removeItem("userid");
  }
  private getAuthData(){
    const token = localStorage.getItem("token");
    const expire = localStorage.getItem("expire");
    const userid = localStorage.getItem("userid");
    if(!token || !expire || !userid ){
      return ;
    }
    return {
      token : token,
      expire : new Date(expire),
      userid : userid
    }
  }
}
