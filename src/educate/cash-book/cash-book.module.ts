import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BanksComponent } from './banks/banks.component';
import { BankAccountsComponent } from './bank-accounts/bank-accounts.component';
import { PortalModule } from 'src/portal/portal.module';
import { FormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MenubarModule } from 'primeng/menubar';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { TableModule } from 'primeng/table';


@NgModule({
  declarations: [BanksComponent, BankAccountsComponent],
  imports: [
    CommonModule,
    PortalModule,
    FormsModule,
    ToastModule,
    InputTextModule,
    DialogModule,
    ConfirmDialogModule,
    MenubarModule,
    ButtonModule,
    CheckboxModule,
    TableModule
  ]
})
export class CashBookModule { }
