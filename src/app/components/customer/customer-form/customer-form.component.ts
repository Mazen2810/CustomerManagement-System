import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { CustomerService } from '../../../shared/services/customer.service';
import { ImageUploadService } from '../../../shared/services/image-upload.service';
import { InputFieldComponent } from '../../shared/input-field/input-field';
import { RouterLink , Router} from '@angular/router';
import { SweetAlertService } from '../../../shared/services/sweet-alert.service';
import { ActivatedRoute } from '@angular/router';
import { Button } from '../../shared/button/button';
import { MediaInput } from '../../shared/media-input/media-input';
import { LoadingSpinner } from "../../shared/loading-spinner/loading-spinner";

@Component({
  selector: 'app-customer-form',
  imports: [ReactiveFormsModule, InputFieldComponent, RouterLink, Button, MediaInput, LoadingSpinner],
  templateUrl: './customer-form.component.html',
  styleUrl: './customer-form.component.scss',
})
export class CustomerFormComponent implements OnInit{

  // Injections
  private FormBuilder = inject(FormBuilder);
  private customerService = inject(CustomerService);
  private imageUploadService = inject(ImageUploadService);
  private sweetAlertService = inject(SweetAlertService);
  private route = inject(ActivatedRoute);
  private router = inject(Router)

 
  

  
  // Signals
  uploadedImages = signal<string[]>([]);
  isLoading = signal<boolean>(false);
  isImageUploaded = signal<boolean>(false);
  pendingBrandLogo = signal<File | null>(null);
  pendingImages = signal<File[]>([]);
  pendingImagePreviews = signal<string[]>([]);
  customerId: string | null = null;

  // Form Group
  customerForm: FormGroup = this.FormBuilder.group(
    {
      brandName: [null, [Validators.required, Validators.maxLength(30)]],
      brandLogoUrl: [null],
      companyName: [null, [Validators.required, Validators.maxLength(30)]],
      taxNumber: [null, [Validators.required, Validators.pattern(/^.{9}$/)]],
      companyAddress: [null, [Validators.required, Validators.maxLength(50)]],
      shopLocation: [null, [Validators.required, Validators.maxLength(50)]],
      contactPersonName: [null, [Validators.required, Validators.maxLength(30)]],
      contactPersonPhone: [null, [Validators.required, Validators.pattern(/^01[0125][0-9]{8}$/)]],
      startDate: [null, [Validators.required]],
      endDate: [null, [Validators.required]], // end date must be after start date
      images: [''],
    },
    {
      validators: this.endDateValidator, // custom validator for End Date
    },
  );



  // if there is an ID in the route -> edit form and apply customer data to inputs as soon as component load
  ngOnInit() {
    this.route.paramMap.subscribe({
      next: async (para) => {
        // get id from route **if exists
        this.customerId = para.get('id');
        if (this.customerId) {
          try {
            this.isLoading.set(true);
            const customer = await this.customerService.getCustomerById(this.customerId);

            // assign the form inputs to customer's data
            if (customer) {
              this.customerForm.patchValue({
                brandName: customer.brandName,
                brandLogoUrl: customer.brandLogoUrl,
                companyName: customer.companyName,
                taxNumber: customer.taxNumber,
                companyAddress: customer.companyAddress,
                shopLocation: customer.shopLocation,
                contactPersonName: customer.contactPersonName,
                contactPersonPhone: customer.contactPersonPhone,
                startDate: customer.startDate,
                endDate: customer.endDate,
                images: customer.images || [],
              });
              this.uploadedImages.set(customer.images || []);
            }
          } catch (err) {
            console.error('Error fetching customer:', err);
            this.sweetAlertService.error('Failed to load customer data');
          } finally {
            this.isLoading.set(false);
          }
        }
      },
    });
  }
  //Function to submit or Edit the form
  async submitForm() {
    if (this.customerForm.valid) {
      try {
        this.isLoading.set(true);

        // if there is id -> updating
        if (this.customerId) {

           // check if Brand Logo changed
           // if so upload the new logo
          if (this.pendingBrandLogo()) {
            await this.handleImageUpload(this.pendingBrandLogo(), false);
          }
           // check if Images changed
           // if so upload the new images
          if (this.pendingImages()) {
            await this.handleImageUpload(this.pendingImages(), true);
          }
          // update customer
          await this.customerService.updateCustomer(this.customerId, this.customerForm.value);
          this.sweetAlertService.success('Customer updated successfully');
          this.router.navigate(['/customer-list'])
        } else {
          // if not -> creating
          
          if (this.pendingBrandLogo()) {
            await this.handleImageUpload(this.pendingBrandLogo(), false);
          }
          if (this.pendingImages()) {
            await this.handleImageUpload(this.pendingImages(), true);
          }
          await this.customerService.createCustomer(this.customerForm.value);
          this.sweetAlertService.success('Customer added successfully');
          this.customerForm.reset();
          this.uploadedImages.set([]);
          this.pendingImages.set([]);
          this.router.navigate(['/customer-list'])
        }
      } catch (err) {
        this.sweetAlertService.error('Failed to add a customer');
      } finally {
        this.isLoading.set(false);
      }
    }
  }

  

  // Function to handle images upload
  handleImageUpload(fileOrFiles: File | File[] | null, isMultiple: boolean): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!fileOrFiles) {
        resolve();
        return;
      }
      // check if it array of files -> remain as it is || if one file -> wrap up in array
      const files = Array.isArray(fileOrFiles) ? fileOrFiles : [fileOrFiles];
      if (files.length === 0) {
        resolve();
        return;
      }

      this.isImageUploaded.set(true);
      let uploadedCount = 0; // to track the uploaded images

      files.forEach((file) => {
        this.imageUploadService.uploadToCloudinary(file).subscribe({
          next: (url: string) => {
            // check if it is multiple images -> update UploadedImage signal || if single image -> patch it to the form
            if (isMultiple) {
              this.uploadedImages.update((images) => [...images, url]);
            } else {
              this.customerForm.patchValue({ brandLogoUrl: url });
            }
            uploadedCount++;

            //if All images are in UploadedImage signal -> patch to form
            if (uploadedCount === files.length) {
              if (isMultiple) {
                this.customerForm.patchValue({ images: this.uploadedImages() });
              }
              this.isImageUploaded.set(false);
              resolve();
            }
          },
          error: (err) => {
            console.error('Image upload failed:', err);
            uploadedCount++;
            this.sweetAlertService.error('Failed to upload the Image', err);

            // patch even if there was an error in one of images
            if (uploadedCount === files.length) {
              if (isMultiple) {
                this.customerForm.patchValue({ images: this.uploadedImages() });
              }
              this.isImageUploaded.set(false);
            }
          },
        });
      });
    });
  }

  
  
  // Handle the custom validator for endDate
  endDateValidator(control: AbstractControl): ValidationErrors | null {
    const startDate = control.get('startDate')?.value;
    const endDate = control.get('endDate')?.value;
    const endDateControl = control.get('endDate'); // ref to the controller itself
    
    // if startDate and endDate are not null & endDate < startDate
    if (startDate && endDate && endDate <= startDate) {
      endDateControl?.setErrors({ ...endDateControl.errors, EndDateStartDateMismatch: true }); // set the error among the validator level
    } 
    
     // in case there was endDateStartDateMismatch error and then it resolved
    else if (endDateControl?.hasError('EndDateStartDateMismatch'))
    {
      const errors = { ...endDateControl?.errors }; // put all errors in variable
      delete errors['EndDateStartDateMismatch']; // remove endDateStartDateMismatch error from them
      endDateControl.setErrors(Object.keys(errors).length ? errors : null); // assign the rest errors to the control
    }
    return null; // if there are no errors
  }
  
  // Select the file from the input and assign it to pendingBrandLogo signal
  onBrandLogoSelected(files: FileList) {
    this.pendingBrandLogo.set(files[0]);
    console.log(this.pendingBrandLogo());
  }
  

  // Select the files from the input and assign it to pendingImages signal
  // then convert those files to URL object to be able to display it 
  onImagesSelected(files: FileList) {
    const newFiles = Array.from(files);
    this.pendingImages.update((image) => [...image, ...newFiles]);
    
    const newPreviews = newFiles.map(file => URL.createObjectURL(file));
    this.pendingImagePreviews.update((previews) => [...previews, ...newPreviews]);
  }

  // Function to remove one of the uploaded images
  removeImage(index: number) {
    // using this to tell the browser that the image is no longer needed to not to keep its reference
    URL.revokeObjectURL(this.pendingImagePreviews()[index]);
   
    this.pendingImagePreviews.update((previews) => previews.filter((_, i) => i !== index));
  }
}
