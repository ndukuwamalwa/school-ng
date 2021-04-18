import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EducateMenuComponent } from './educate-menu/educate-menu.component';
import { PanelMenuModule } from 'primeng/panelmenu';
import { CardModule } from 'primeng/card';
import { LoginComponent } from './login/login.component';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { MessageModule } from 'primeng/message';
import { ChipModule } from 'primeng/chip';


@NgModule({
  declarations: [
    EducateMenuComponent,
    LoginComponent
  ],
  imports: [
    CommonModule,
    PanelMenuModule,
    CardModule,
    FormsModule,
    InputTextModule,
    ButtonModule,
    DividerModule,
    MessageModule,
    ChipModule
  ],
  exports: [
    EducateMenuComponent
  ]
})
export class PortalModule { }
