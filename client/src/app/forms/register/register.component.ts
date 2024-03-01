import { Component, EventEmitter, NgModule, Output, inject } from '@angular/core';

import { FormBuilder, Validators } from '@angular/forms';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { Router } from '@angular/router';
import { AccountService } from 'src/app/services/account.service';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  model: any = {};
  @Output() cancelRegister = new EventEmitter();

  private fb = inject(FormBuilder);
  registerForm = this.fb.group({
    firstName: [null, Validators.required],
    lastName: [null, Validators.required],
    emailaddress: [null, Validators.required],
    username: [null, Validators.required],
    password: [null, Validators.required],
    confirmpassword: [null, Validators.required]
  });

  constructor(private accountService : AccountService, private router: Router){}

  onSubmit(): void {
    console.log(this.registerForm);
    this.model.username = this.registerForm.value.username;
    this.model.password = this.registerForm.value.password;
    this.accountService.register(this.model).subscribe({
      next: response => {
        console.log(response);
        this.cancel();
        this.router.navigateByUrl('/home');
      },
      error: error => console.log(error)
    })
  }

  cancel()
  {
    this.cancelRegister.emit(false);
  }
}
