import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-button',
  imports: [CommonModule],
  templateUrl: './button.html',
  styleUrl: './button.scss',
})
export class Button {
  @Input() type!: string;
  @Input() disabled: boolean = false;
  @Input() title!: string;
  @Input() customClasses!: string | string[];
  // can add classes in form of "btn btn-primary btn-lg" or ['btn' , 'btn-primary']
}
