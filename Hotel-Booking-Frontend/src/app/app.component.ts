import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  currentUser$;
  isLoading = false;

  constructor(public authSrv: AuthService) {
    this.currentUser$ = this.authSrv.currentUser$;

    this.authSrv.loading$.subscribe((loading) => {
      this.isLoading = loading;
    });
  }

  logout(): void {
    this.authSrv.logout();
  }
}
