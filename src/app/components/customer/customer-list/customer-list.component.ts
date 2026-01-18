import { Component, inject, OnInit, signal } from '@angular/core';
import { CustomerService } from '../../../shared/services/customer.service';
import { Customer } from '../../../interfaces/Icustomer';
import { RouterLink } from '@angular/router';
import { LoadingSpinner } from '../../shared/loading-spinner/loading-spinner';
import Swal from 'sweetalert2';
import { SweetAlertService } from '../../../shared/services/sweet-alert.service';
import { FormsModule } from '@angular/forms';
import { SearchPipe } from '../../../shared/pipes/search.pipe';
import { Button } from '../../shared/button/button';

@Component({
  selector: 'app-customer-list',
  imports: [RouterLink, LoadingSpinner, FormsModule, SearchPipe, Button],
  templateUrl: './customer-list.component.html',
  styleUrl: './customer-list.component.scss',
})
export class CustomerListComponent implements OnInit {
  // Injections
  private customerService = inject(CustomerService);
  private sweetAlertService = inject(SweetAlertService)

  // Signals
  customerList = signal<(Customer & { id: string })[]>([]);
  isLoading = signal<boolean>(false);
  searchText= signal<string>('');

  // retrieve all the data 
  ngOnInit(): void {
    this.getAllCustomers();
  }

  // Get All Customers
  async getAllCustomers() {
    try {
      this.isLoading.set(true);
      const customers = await this.customerService.getCustomers();
      this.customerList.set(customers as (Customer & { id: string })[]);
    } catch (error) {
      console.log(error);
    } finally {
      this.isLoading.set(false);
    }
  }

  // Delete Customer
  async DeleteCustomer(id: string) {
   this.sweetAlertService.confirmDelete().then((result) => {
      if (result.isConfirmed) {
        // User confirmed - proceed with deletion
        try {
          this.customerService.deleteCustomer(id);
          Swal.fire('Deleted!', 'Customer has been deleted.', 'success');
          this.getAllCustomers()
        } catch (error) {
          Swal.fire('Error!', 'Failed to delete customer.', 'error');
        }
      }
    });
  }

 // check is contract is active
 isContractActive(endDate: Date): boolean {
    return this.customerService.isContractActive(endDate)
  }
  
}
