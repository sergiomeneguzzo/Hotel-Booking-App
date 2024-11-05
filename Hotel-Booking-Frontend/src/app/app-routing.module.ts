import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/auth/login/login.component';
import { RegisterComponent } from './pages/auth/register/register.component';
import { HomeComponent } from './pages/home/home.component';
import { CheckEmailComponent } from './pages/auth/check-email/check-email.component';
import { EmailConfirmedComponent } from './pages/auth/email-confirmed/email-confirmed.component';
import { authGuard } from './guards/auth.guard';
import { NewAddComponent } from './pages/new-add/new-add.component';
import { HotelListComponent } from './pages/hotel-list/hotel-list.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { guestGuard } from './guards/guest.guard';
import { HotelDetailComponent } from './pages/hotel-detail/hotel-detail.component';
import { ReservationsComponent } from './pages/reservations/reservations.component';
import { HomesComponent } from './pages/homes/homes.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent, canActivate: [guestGuard] },
  { path: 'register', component: RegisterComponent, canActivate: [guestGuard] },
  { path: 'check-email', component: CheckEmailComponent },
  { path: 'email-confirmed', component: EmailConfirmedComponent },
  { path: 'home', component: HomeComponent, canActivate: [authGuard] },
  { path: 'new-add', component: NewAddComponent, canActivate: [authGuard] },
  { path: 'hotels', component: HotelListComponent, canActivate: [authGuard] },
  { path: 'homes', component: HomesComponent, canActivate: [authGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [authGuard] },
  {
    path: 'hotels/:id',
    component: HotelDetailComponent,
    canActivate: [authGuard],
  },
  {
    path: 'bookings',
    component: ReservationsComponent,
    canActivate: [authGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
