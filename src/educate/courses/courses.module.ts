import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CourseListComponent } from './course-list/course-list.component';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { PortalModule } from 'src/portal/portal.module';
import { MenubarModule } from 'primeng/menubar';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';



@NgModule({
  declarations: [CourseListComponent],
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ToastModule,
    DialogModule,
    InputTextModule,
    InputNumberModule,
    PortalModule,
    MenubarModule,
    ConfirmDialogModule,
    ButtonModule,
    DropdownModule
  ]
})
export class CoursesModule { }
