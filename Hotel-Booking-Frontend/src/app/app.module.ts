import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {
  MatCard,
  MatCardContent,
  MatCardFooter,
  MatCardModule,
} from '@angular/material/card';
import { DatePipe, NgOptimizedImage } from '@angular/common';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { MatInput, MatInputModule } from '@angular/material/input';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RegisterComponent } from './pages/auth/register/register.component';
import { HomeComponent } from './pages/home/home.component';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import {
  HTTP_INTERCEPTORS,
  HttpClient,
  HttpClientModule,
} from '@angular/common/http';
import { AuthInterceptor } from './utils/auth.interceptor';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { CheckEmailComponent } from './pages/auth/check-email/check-email.component';
import { EmailConfirmedComponent } from './pages/auth/email-confirmed/email-confirmed.component';
import { NewAddComponent } from './pages/new-add/new-add.component';
import { HotelListComponent } from './pages/hotel-list/hotel-list.component';
import { HotelCardComponent } from './components/hotel-card/hotel-card.component';
import { MatSliderModule } from '@angular/material/slider';
import { ProfileComponent } from './pages/profile/profile.component';
import {
  DateAdapter,
  MatNativeDateModule,
  MatOption,
} from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { HotelDetailComponent } from './pages/hotel-detail/hotel-detail.component';
import { registerLocaleData } from '@angular/common';
import localeIt from '@angular/common/locales/it';
import { ReservationsComponent } from './pages/reservations/reservations.component';
import { LoaderComponent } from './components/loader/loader.component';
import { HomesComponent } from './pages/homes/homes.component';

registerLocaleData(localeIt);
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    NavBarComponent,
    CheckEmailComponent,
    EmailConfirmedComponent,
    NewAddComponent,
    HotelListComponent,
    HotelCardComponent,
    ProfileComponent,
    HotelDetailComponent,
    ReservationsComponent,
    LoaderComponent,
    HomesComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    MatCard,
    NgOptimizedImage,
    MatCardContent,
    MatFormField,
    MatInput,
    MatIconButton,
    MatButton,
    MatCardFooter,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatCardModule,
    MatButtonModule,
    MatSnackBarModule,
    FormsModule,
    MatSliderModule,
    MatOption,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
  ],
  providers: [
    provideAnimationsAsync(),
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    [{ provide: LOCALE_ID, useValue: 'it' }, DatePipe],
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
