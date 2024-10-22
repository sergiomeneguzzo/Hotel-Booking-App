import { Component, EventEmitter, Input, Output } from '@angular/core';
import { User } from '../../interfaces/user.entity';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.scss',
})
export class NavBarComponent {
  @Output() logout = new EventEmitter<void>();
  @Input() user: User | null = null;

  onLogout() {
    this.logout.emit();
  }
}
