import { Component, inject, OnInit, signal } from '@angular/core';
import { Customer } from '../../../interfaces/Icustomer';
import { DatePipe } from '@angular/common';
import { CustomerService } from '../../../shared/services/customer.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { SweetAlertService } from '../../../shared/services/sweet-alert.service';
import { QRCodeComponent } from 'angularx-qrcode';
import { Button } from '../../shared/button/button';
import { LoadingSpinner } from "../../shared/loading-spinner/loading-spinner";

@Component({
  selector: 'app-tenant-form',
  imports: [DatePipe, RouterLink, QRCodeComponent, Button, LoadingSpinner],
  templateUrl: './tenant-form.component.html',
  styleUrl: './tenant-form.component.scss',
})
export class TenantFormComponent implements OnInit {
  // Injections
  private customerService = inject(CustomerService);
  private route = inject(ActivatedRoute);
  private sweetAlertService = inject(SweetAlertService);

  // Signals
  customer = signal<(Customer & { id: string }) | null>(null);
  isLoading = signal<boolean>(false);

  // Variables
  customerId: string | null = null;
  qrData: string = '';
  today = new Date();


  // retrieve data
  ngOnInit(): void {
    this.route.paramMap.subscribe({
      next: async (para) => {
        this.customerId = para.get('id');
        if (this.customerId) {
          try {
            this.isLoading.set(true);
            const customer = await this.customerService.getCustomerById(this.customerId);
            this.customer.set(customer);
            this.generateQRData(this.customerId)
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

  // though it would be a better but the JSON is not Formatted well

  // generateQRData(customer: (Customer & {id:string})| null) {
  //   const customerQrData = {
  //     id: customer?.id,
  //     brandName: customer?.brandName,
  //     companyName: customer?.companyName,
  //     taxNumber: customer?.taxNumber,
  //     companyAddress: customer?.companyAddress,
  //     shopLocation: customer?.shopLocation,
  //     contactPersonName: customer?.contactPersonName,
  //     contactPersonPhone: customer?.contactPersonPhone,
  //     startDate: customer?.startDate,
  //     endDate: customer?.endDate,
  //     customerStatus: this.contractActive
  //   };

  //   this.qrData = JSON.stringify(customerQrData);
  // }

  // Function to assign the page url to qr code
  generateQRData(customerId: string){
   this.qrData = `${window.location.origin}/tenant-form/${customerId}`;
  }


  // Print Function
  printPage() {
    this.customerService.printPage();
  }

  // check if contract is active - returns false if customer is null
  get contractActive(): boolean {
    const customerCheck = this.customer();
    if (!customerCheck || !customerCheck.endDate) return false;
    return this.customerService.isContractActive(customerCheck.endDate);
  }
}
