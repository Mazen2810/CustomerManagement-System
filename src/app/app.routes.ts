
import { Routes } from '@angular/router';
import { CustomerListComponent } from './components/customer/customer-list/customer-list.component';
import { CustomerFormComponent } from './components/customer/customer-form/customer-form.component';
import { TenantFormComponent } from './components/tenant/tenant-form.component/tenant-form.component';

export const routes: Routes = [
    {path: '' , redirectTo: 'customer-list', pathMatch: 'full'},
    {path: 'customer-list', component: CustomerListComponent},
    {path: 'customer/create', component: CustomerFormComponent  },
    {path: 'customer/edit/:id', component: CustomerFormComponent  },
    {path: 'tenant-info/:id', component: TenantFormComponent}
    
];
