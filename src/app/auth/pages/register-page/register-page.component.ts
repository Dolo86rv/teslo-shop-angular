import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@auth/services/auth.service';
import { AlertInfoComponent } from "../../../products/components/alert-info/alert-info.component";
import { FullName } from '@products/intefaces/product-response.interface';

@Component({
  selector: 'app-register-page',
  imports: [ReactiveFormsModule, AlertInfoComponent],
  templateUrl: './register-page.component.html',
})
export class RegisterPageComponent {

  fb = inject(FormBuilder);
  hasError = signal(false);
  isPosting = signal(false);
  router = inject(Router);

  authService = inject(AuthService);

  registerForm: FormGroup = this.fb.group({
    fullName: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  onSubmit() {
    if (this.registerForm.invalid) {
      this.hasError.set(true);
      setTimeout(() => {
        this.hasError.set(true);
      }, 2000);
    }

    const { fullName = '', email = '', password = ''} = this.registerForm.value;

    this.authService.register(fullName, email!, password).subscribe(isAuthenticated => {
      if (isAuthenticated) {
        this.router.navigateByUrl('/');
        return;
      }

      this.hasError.set(true);
      setTimeout(() => {
        this.hasError.set(true);
      }, 2000);
    })
  }

}

