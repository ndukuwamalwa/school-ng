import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortalModule } from 'src/portal/portal.module';
import { UserRolesComponent } from './user-roles/user-roles.component';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { CardModule } from 'primeng/card';
import { InputSwitchModule } from 'primeng/inputswitch';
import { UserListComponent } from './user-list/user-list.component';
import { MenubarModule } from 'primeng/menubar';
import { DropdownModule } from 'primeng/dropdown';

@NgModule({
  declarations: [UserRolesComponent, UserListComponent],
  imports: [
    CommonModule,
    PortalModule,
    FormsModule,
    InputTextModule,
    ButtonModule,
    TableModule,
    DialogModule,
    ConfirmDialogModule,
    ToastModule,
    CardModule,
    InputSwitchModule,
    MenubarModule,
    DropdownModule
  ],
  providers: [ConfirmationService, MessageService]
})
export class UsersModule { }
