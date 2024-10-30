import { NgModule } from '@angular/core';
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
import { NgOptimizedImage } from '@angular/common';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { MatInput, MatInputModule } from '@angular/material/input';
import { MatButton, MatIconButton } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RegisterComponent } from './pages/auth/register/register.component';
import { HomeComponent } from './pages/home/home.component';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { CardsComponent } from './components/cards/cards.component';
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
import { MatOption } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    NavBarComponent,
    CardsComponent,
    CheckEmailComponent,
    EmailConfirmedComponent,
    NewAddComponent,
    HotelListComponent,
    HotelCardComponent,
    ProfileComponent,
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
    MatIconButton,
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
  ],
  providers: [
    provideAnimationsAsync(),
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
