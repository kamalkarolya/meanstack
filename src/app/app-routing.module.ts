import { NgModule } from "@angular/core";
import { Routes,RouterModule } from "@angular/router";
import { PostCreateComponent } from "./posts/create-post.component";
import { PostListComponent } from "./posts/postlist/postlist.component";
import { LoginComponent } from "./auth/login/login.component";
import { SignupComponent } from "./auth/signup/signup.component";
import { AuthGuard } from "./auth/auth.guard";
const route : Routes=[
  {path:'', component:PostListComponent },
  { path:'create' , component:PostCreateComponent,canActivate:[AuthGuard] },
  { path:'edit/:postId' , component:PostCreateComponent,canActivate:[AuthGuard]  },
  { path:'login' , component:LoginComponent },
  { path:'signup' , component:SignupComponent },

];
@NgModule({
 imports:[ RouterModule.forRoot(route) ],
 exports:[RouterModule],
 providers:[AuthGuard]
})

export class AppRoutingModule{}
