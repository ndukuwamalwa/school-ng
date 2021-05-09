import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from 'src/portal/login/login.component';
import { AuthenticatedGuard } from 'src/guards/authenticated.guard';
import { TicketsComponent } from 'src/educate/tickets/tickets/tickets.component';
import { UserRolesComponent } from 'src/educate/users/user-roles/user-roles.component';
import { UserListComponent } from 'src/educate/users/user-list/user-list.component';
import { EmployeeListComponent } from 'src/educate/employees/employee-list/employee-list.component';
import { DepartmentsListComponent } from 'src/educate/departments/departments-list/departments-list.component';
import { BanksComponent } from 'src/educate/cash-book/banks/banks.component';
import { BankAccountsComponent } from 'src/educate/cash-book/bank-accounts/bank-accounts.component';
import { DepartmentsResolver } from 'src/resolvers/departments.resolver';
import { BanksResolver } from 'src/resolvers/banks.resolver';
import { CourseListComponent } from 'src/educate/courses/course-list/course-list.component';

const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
    canActivate: [AuthenticatedGuard]
  },
  {
    path: 'courses/list',
    component: CourseListComponent,
    canActivate: [AuthenticatedGuard],
    resolve: {
      departments: DepartmentsResolver
    }
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
    path: 'employees/list',
    component: EmployeeListComponent,
    canActivate: [AuthenticatedGuard],
    resolve: {
      banks: BanksResolver,
      departments: DepartmentsResolver
    }
  },
  {
    path: 'departments/list',
    component: DepartmentsListComponent,
    canActivate: [AuthenticatedGuard]
  },
  {
    path: 'banks',
    component: BanksComponent,
    canActivate: [AuthenticatedGuard]
  },
  {
    path: 'banks/accounts',
    component: BankAccountsComponent,
    canActivate: [AuthenticatedGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
