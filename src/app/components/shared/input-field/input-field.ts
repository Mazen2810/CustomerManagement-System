import { Component, Input } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-input-field',
  imports: [NgClass, ReactiveFormsModule],
  templateUrl: './input-field.html',
  styleUrl: './input-field.scss',
})
export class InputFieldComponent {
  @Input() formGroup!: FormGroup;
  @Input() controlName!: string;
  @Input() formControl!: FormControl;  // For FormArray usage
  @Input() label!: string;
  @Input() type: string = 'text';
  @Input() id!: string;
  @Input() placeholder: string = '';
  @Input() accept!: string;
  @Input() errors: { key: string; message: string }[] = [];

  get control() {
    
    return  this.formGroup?.get(this.controlName);
  }

  get isTouchedOrDirty(){
    return !!(this.control?.touched || this.control?.dirty); 
  }

  get IsInvalid(){
    return !!(this.control?.errors && this.isTouchedOrDirty);
  }

  get IsValid(){
    return !!(!this.control?.errors && this.isTouchedOrDirty);
  }
}
