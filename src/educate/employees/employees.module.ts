import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeeListComponent } from './employee-list/employee-list.component';
import { PortalModule } from 'src/portal/portal.module';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MenubarModule } from 'primeng/menubar';
import { ToastModule } from 'primeng/toast';
import { TableModule } from 'primeng/table';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';


@NgModule({
  declarations: [EmployeeListComponent],
  imports: [
    CommonModule,
    PortalModule,
    ButtonModule,
    InputTextModule,
    MenubarModule,
    ToastModule,
    TableModule,
    FormsModule,
    DialogModule,
    DropdownModule,
    CalendarModule
  ]
})
export class EmployeesModule { }
