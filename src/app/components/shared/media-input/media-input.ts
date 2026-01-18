import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup ,FormControl, ReactiveFormsModule} from '@angular/forms';
@Component({
  selector: 'app-media-input',
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './media-input.html',
  styleUrl: './media-input.scss',
})
export class MediaInput {
  @Input() customClasses!: string | string[];
  @Input() id: string = '';
  
 
  @Input() isMultiple: boolean = false;
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  @Output() fileSelected = new EventEmitter<FileList>;

 

  click() {
    this.fileInput.nativeElement.click();
  }


  onFileChange(event: Event){
    const input = event.target as HTMLInputElement;
    if(input.files){
      this.fileSelected.emit(input.files)
    }
  }

}
