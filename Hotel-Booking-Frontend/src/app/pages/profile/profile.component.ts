import { Component } from '@angular/core';
import { User } from '../../interfaces/user.entity';
import { AuthService } from '../../services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { ChangePasswordComponent } from '../../components/change-password/change-password.component';
import { EditPictureComponent } from '../../components/edit-picture/edit-picture.component';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent {
  user: User | null = null;
  isLoading = false;

  constructor(
    private authService: AuthService,
    public dialog: MatDialog,
    private notify: NotificationService
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.authService.currentUser$.subscribe((user) => {
      this.user = user;
      this.isLoading = false;
    });
  }

  openChangePasswordDialog(): void {
    const dialogRef = this.dialog.open(ChangePasswordComponent, {
      width: '400px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
      }
    });
  }

  openEditPictureDialog(): void {
    const dialogRef = this.dialog.open(EditPictureComponent, {
      width: '400px',
      data: { currentPicture: this.user?.picture },
    });

    dialogRef.afterClosed().subscribe((newPictureUrl) => {
      if (newPictureUrl) {
        console.log(newPictureUrl);
        this.authService.updateUserPicture(newPictureUrl).subscribe(() => {
          this.user!.picture = newPictureUrl;
          this.notify.successMessage('Profile picture updated successfully');
        });
      }
    });
  }
}
