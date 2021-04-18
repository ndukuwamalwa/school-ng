import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TicketsComponent } from './tickets/tickets.component';
import { PortalModule } from 'src/portal/portal.module';



@NgModule({
  declarations: [TicketsComponent],
  imports: [
    CommonModule,
    PortalModule
  ]
})
export class TicketsModule { }
