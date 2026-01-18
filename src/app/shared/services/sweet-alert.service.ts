import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class SweetAlertService {
  success(title: string, message?: string) {
   return Swal.fire({
      position: 'top-end',
      icon: 'success',
      title: title,
      text: message,
      showConfirmButton: false,
      timer: 1500,
      toast: true
    });
  }
  error(title: string, message?: string) {
    return Swal.fire({
      position: 'top-end',
      icon: 'error',
      title: title,
      text: message,
      showConfirmButton: false,
      timer: 2000,
      toast: true
      
      
    });
  }

  confirmDelete(){
    return Swal.fire({
          title: 'Are you sure?',
          text: "You won't be able to revert this!",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#d33',
          cancelButtonColor: '#3085d6',
          confirmButtonText: 'Yes, delete it!',
          cancelButtonText: 'Cancel',
        })
  }
}
