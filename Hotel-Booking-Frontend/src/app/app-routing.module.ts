import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/auth/login/login.component';
import { RegisterComponent } from './pages/auth/register/register.component';
import { HomeComponent } from './pages/home/home.component';
import { CheckEmailComponent } from './pages/auth/check-email/check-email.component';
import { EmailConfirmedComponent } from './pages/auth/email-confirmed/email-confirmed.component';
import { authGuard } from './guards/auth.guard';
import { NewAddComponent } from './pages/new-add/new-add.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'check-email', component: CheckEmailComponent },
  { path: 'email-confirmed', component: EmailConfirmedComponent },
  { path: 'home', component: HomeComponent, canActivate: [authGuard] },
  { path: 'new-add', component: NewAddComponent, canActivate: [authGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
