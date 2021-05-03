import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CourseEditComponent } from 'src/courses/course-edit/course-edit.component';
import { LoginComponent } from 'src/portal/login/login.component';
import { AuthenticatedGuard } from 'src/guards/authenticated.guard';
import { TicketsComponent } from 'src/educate/tickets/tickets/tickets.component';
import { UserRolesComponent } from 'src/educate/users/user-roles/user-roles.component';
import { UserListComponent } from 'src/educate/users/user-list/user-list.component';
import { EmployeeCreateComponent } from 'src/educate/employees/employee-create/employee-create.component';

const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
    canActivate: [AuthenticatedGuard]
  },
  {
    path: 'courses',
    component: CourseEditComponent,
    canActivate: [AuthenticatedGuard]
  },
  {
    path: 'tickets',
    component: TicketsComponent,
    canActivate: [AuthenticatedGuard]
  },
  {
    path: 'users/list',
    component: UserListComponent,
    canActivate: [AuthenticatedGuard]
  },
  {
    path: 'users/roles',
    component: UserRolesComponent,
    canActivate: [AuthenticatedGuard]
  },
  {
    path: 'employees/create',
    component: EmployeeCreateComponent,
    canActivate: [AuthenticatedGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
