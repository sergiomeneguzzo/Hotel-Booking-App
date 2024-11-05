import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  Output,
} from '@angular/core';
import { User } from '../../interfaces/user.entity';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.scss',
})
export class NavBarComponent {
  @Output() logout = new EventEmitter<void>();
  @Input() user: User | null = null;
  profileMenuActive: boolean = false;
  navLinksActive = false;
  isMobile: boolean = false;

  constructor(private router: Router) {
    this.checkIfMobile();
  }

  onLogout() {
    this.logout.emit();
  }

  toggleProfileMenu() {
    this.profileMenuActive = !this.profileMenuActive;
  }

  navigateToProfile() {
    this.router.navigate(['/profile']);
  }

  checkIfMobile() {
    this.isMobile = window.innerWidth <= 768;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.checkIfMobile();
  }
}
