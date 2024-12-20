import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  Output,
  ElementRef,
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
  mobileMenuActive: boolean = false;
  profileDropdownActive: boolean = false;

  constructor(private router: Router, private eRef: ElementRef) {
    this.checkIfMobile();
  }

  onLogout() {
    this.logout.emit();
  }

  toggleMobileMenu(): void {
    this.mobileMenuActive = !this.mobileMenuActive;
  }

  toggleProfileDropdown(): void {
    if (!this.isMobile) {
      this.profileDropdownActive = !this.profileDropdownActive;
    }
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

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    if (!this.eRef.nativeElement.contains(event.target)) {
      this.mobileMenuActive = false;
      this.profileDropdownActive = false;
    }
  }
}
