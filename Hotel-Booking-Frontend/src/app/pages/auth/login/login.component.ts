import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil, catchError, throwError } from 'rxjs';
import { AuthService } from '../../../services/auth.service';
import { NotificationService } from '../../../services/notification.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit, OnDestroy {
  hide = true;
  loginForm;
  loginError = '';

  private destroyed$ = new Subject<void>();
  private timeout: any;

  constructor(
    protected fb: FormBuilder,
    private authSrv: AuthService,
    private router: Router,
    private notify: NotificationService
  ) {
    this.loginForm = this.fb.group({
      username: ['', { validators: Validators.required }],
      password: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.loginForm.valueChanges
      .pipe(takeUntil(this.destroyed$))
      .subscribe(() => {
        this.loginError = '';
      });
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  login() {
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;
      this.authSrv
        .login(username!, password!)
        .pipe(
          catchError((err) => {
            if (err.error?.message === 'email not confirmed') {
              this.notify.errorMessage(
                'Your email has not been confirmed. Please check your inbox!'
              );
            } else {
              this.notify.errorMessage('Invalid or incorrect credentials');
            }
            return throwError(() => err);
          })
        )
        .subscribe({
          next: (user) => {
            this.router.navigate(['/home']);
          },
          error: () => {},
        });
    }
  }
}
