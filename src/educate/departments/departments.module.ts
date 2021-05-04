import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortalModule } from 'src/portal/portal.module';
import { DepartmentsListComponent } from './departments-list/departments-list.component';
import { TableModule } from 'primeng/table';


@NgModule({
  declarations: [DepartmentsListComponent],
  imports: [
    CommonModule,
    PortalModule,
    TableModule
  ]
})
export class DepartmentsModule { }
