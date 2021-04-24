import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserFormComponent } from './user-form/user-form.component';
import { PortalModule } from 'src/portal/portal.module';
import { UserRolesComponent } from './user-roles/user-roles.component';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';

@NgModule({
  declarations: [UserFormComponent, UserRolesComponent],
  imports: [
    CommonModule,
    PortalModule,
    FormsModule,
    InputTextModule,
    ButtonModule,
    TableModule
  ]
})
export class UsersModule { }
