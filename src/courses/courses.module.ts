import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CourseEditComponent } from './course-edit/course-edit.component';
import { StepsModule } from 'primeng/steps';
import { PortalModule } from 'src/portal/portal.module';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { DividerModule } from 'primeng/divider';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';


@NgModule({
  declarations: [CourseEditComponent],
  imports: [
    CommonModule,
    StepsModule,
    PortalModule,
    CardModule,
    InputTextModule,
    DropdownModule,
    FormsModule,
    DividerModule,
    ToolbarModule,
    ButtonModule,
    TableModule
  ],
  exports: [
    CourseEditComponent
  ]
})
export class CoursesModule { }
