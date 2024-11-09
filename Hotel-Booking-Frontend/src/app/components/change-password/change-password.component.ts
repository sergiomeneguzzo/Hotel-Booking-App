import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { AuthService } from '../../services/auth.service';
import { strongPasswordValidator } from '../../validators/strongpassword-validator';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
})
export class ChangePasswordComponent {
  changePasswordForm: FormGroup;
  hidePassword = true;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    public dialogRef: MatDialogRef<ChangePasswordComponent>,
    private notify: NotificationService
  ) {
    this.changePasswordForm = this.fb.group(
      {
        newPassword: ['', [Validators.required, strongPasswordValidator()]],
        confirmPassword: ['', Validators.required],
      },
      { validators: this.passwordMatchValidator }
    );
  }

  passwordMatchValidator(form: FormGroup) {
    const newPassword = form.get('newPassword')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;

    if (newPassword && confirmPassword) {
      return newPassword === confirmPassword ? null : { mismatch: true };
    }

    return null;
  }

  togglePasswordVisibility(field: string) {
    if (field === 'newPassword') {
      this.hidePassword = !this.hidePassword;
    } else if (field === 'confirmPassword') {
      this.hidePassword = !this.hidePassword;
    }
  }

  updatePassword() {
    if (this.changePasswordForm.invalid) {
      this.changePasswordForm.markAllAsTouched();
      return;
    }
    this.isLoading = true;
    const { newPassword, confirmPassword } = this.changePasswordForm.value;
    console.log('newPassword', newPassword, 'confirmPassword', confirmPassword);
    this.authService.updatePassword(newPassword, confirmPassword).subscribe(
      (response) => {
        this.isLoading = false;
        this.notify.successMessage('Password updated successfully');
        console.log('Password updated successfully');
        this.dialogRef.close(true);
      },
      (error) => {
        this.isLoading = false;
        this.notify.errorMessage('Password can not be the same as the old one');
        console.error('Password update failed', error);
      }
    );
  }
}
