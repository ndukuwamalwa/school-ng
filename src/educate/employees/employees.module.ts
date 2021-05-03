import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeeCreateComponent } from './employee-create/employee-create.component';
import { PortalModule } from 'src/portal/portal.module';



@NgModule({
  declarations: [EmployeeCreateComponent],
  imports: [
    CommonModule,
    PortalModule
  ]
})
export class EmployeesModule { }
