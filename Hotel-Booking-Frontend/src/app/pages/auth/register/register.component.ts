import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  Validators,
  FormBuilder,
  AbstractControl,
  FormGroup,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from '../../../services/auth.service';
import { urlValidator } from '../../../validators/url-validator';
import { strongPasswordValidator } from '../../../validators/strongpassword-validator';
import { customEmailValidator } from '../../../validators/email-validator';
import { NotificationService } from '../../../services/notification.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent implements OnInit, OnDestroy {
  registerForm: FormGroup;
  hide = true;
  isLoading = false;

  private destroyed$ = new Subject<void>();

  constructor(
    protected fb: FormBuilder,
    private authSrv: AuthService,
    private router: Router,
    private notification: NotificationService
  ) {
    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      picture: ['', [urlValidator(), Validators.required]],
      username: [
        '',
        [Validators.required, Validators.email, customEmailValidator()],
      ],
      password: ['', [Validators.required, strongPasswordValidator()]],
      confirmPassword: [
        '',
        [Validators.required, this.matchPasswordValidator('password')],
      ],
    });
  }

  ngOnInit(): void {
    this.registerForm.valueChanges.pipe(takeUntil(this.destroyed$));
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  register() {
    if (this.registerForm.valid) {
      this.isLoading = true;
      const {
        firstName,
        lastName,
        username,
        picture,
        password,
        confirmPassword,
      } = this.registerForm.value;
      console.log('Credenziali', this.registerForm.value);
      this.authSrv
        .register(
          firstName!,
          lastName!,
          username!,
          picture!,
          password!,
          confirmPassword!
        )
        .subscribe({
          next: (res) => {
            this.isLoading = false;
            this.notification.successMessage('Registration successful');
            this.router.navigate([`/check-email`]);
          },
          error: (err) => {
            this.isLoading = false;
            if (err.error && err.error.message) {
              if (err.error.error === 'UserExistsError') {
                this.notification.errorMessage(
                  'Email already in use. Try a different one'
                );
              } else if (err.error.error === 'PasswordMismatch') {
                this.notification.errorMessage(
                  'Passwords do not match. Please try again.'
                );
              } else {
                this.notification.errorMessage(
                  'Registration failed. Please try again later'
                );
              }
            } else {
              this.notification.errorMessage(
                'Registration failed. Please try again later'
              );
            }
          },
        });
    } else {
      this.isLoading = false;
      this.notification.errorMessage('Please fill in all fields correctly.');
    }
  }

  matchPasswordValidator(passwordField: string) {
    return (control: any) => {
      const form = control.parent;
      if (form) {
        const password = form.get(passwordField)?.value;
        return password === control.value ? null : { passwordMismatch: true };
      }
      return null;
    };
  }
}
