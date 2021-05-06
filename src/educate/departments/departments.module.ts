import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortalModule } from 'src/portal/portal.module';
import { DepartmentsListComponent } from './departments-list/departments-list.component';
import { TableModule } from 'primeng/table';
import { MenubarModule } from 'primeng/menubar';
import { DialogModule } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@NgModule({
  declarations: [DepartmentsListComponent],
  imports: [
    CommonModule,
    PortalModule,
    TableModule,
    MenubarModule,
    DialogModule,
    FormsModule,
    InputTextModule,
    ButtonModule,
    DropdownModule,
    ToastModule,
    ConfirmDialogModule
  ]
})
export class DepartmentsModule { }
