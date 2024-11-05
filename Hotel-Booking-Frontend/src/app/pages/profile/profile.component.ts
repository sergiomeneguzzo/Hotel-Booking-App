import { Component } from '@angular/core';
import { User } from '../../interfaces/user.entity';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent {
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
