import { Component, EventEmitter, NgModule, Output, inject } from '@angular/core';

import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
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
  registerForm: FormGroup = new FormGroup({});
  private fb = inject(FormBuilder);
  


  constructor(private accountService : AccountService, private router: Router){}

  ngOnInit(){
    this.initializeForm();
  }


  initializeForm(): void {
    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      emailaddress: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmpassword: ['', [Validators.required, this.matchValues('password')]]
    });
  
    this.registerForm.controls['password'].valueChanges.subscribe({
      next: () => this.registerForm.controls['confirmpassword'].updateValueAndValidity()
    });
  }

  onSubmit(): void {
    this.model.username = this.registerForm.value.username;
    this.model.password = this.registerForm.value.password;
    this.accountService.register(this.model).subscribe({
      next: response => {
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
  matchValues(matchTo: string): ValidatorFn {
    return (control: AbstractControl) =>{
      return control.value === control.parent?.get(matchTo)?.value ? null : {notMatching: true};
    }
    
  }
}
