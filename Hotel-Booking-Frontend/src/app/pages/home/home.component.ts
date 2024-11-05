import { Component, ViewEncapsulation } from '@angular/core';
import { User } from '../../interfaces/user.entity';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  user: User | null = null;
  isLoading = false;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.authService.currentUser$.subscribe((user) => {
      this.user = user;
      this.isLoading = false;
    });
  }
}
