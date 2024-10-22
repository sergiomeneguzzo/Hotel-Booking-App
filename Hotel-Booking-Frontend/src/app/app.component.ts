import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  currentUser$;

  constructor(public authSrv: AuthService) {
    this.currentUser$ = this.authSrv.currentUser$;
  }

  logout(): void {
    this.authSrv.logout();
  }
}
