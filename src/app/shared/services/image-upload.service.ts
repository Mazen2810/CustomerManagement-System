import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ImageUploadService {
  private cloudinaryUrl: string = 'https://api.cloudinary.com/v1_1/dcjzqwkxh/image/upload';
  private http = inject(HttpClient);

  uploadToCloudinary(file: File): Observable<string> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'Shop_Images');

    return this.http
      .post<{ secure_url: string }>(this.cloudinaryUrl, formData)
      .pipe(map((response) => response.secure_url));
  }
}
