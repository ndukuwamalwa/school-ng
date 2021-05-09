import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { PortalModule } from 'src/portal/portal.module';
import { GraphQLModule } from './graphql.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptor } from 'src/interceptors/token.interceptor';
import { TicketsModule } from 'src/educate/tickets/tickets.module';
import { UsersModule } from 'src/educate/users/users.module';
import { EmployeesModule } from 'src/educate/employees/employees.module';
import { DepartmentsModule } from 'src/educate/departments/departments.module';
import { CashBookModule } from 'src/educate/cash-book/cash-book.module';
import { CoursesModule } from 'src/educate/courses/courses.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    PortalModule,
    GraphQLModule,
    HttpClientModule,
    TicketsModule,
    UsersModule,
    EmployeesModule,
    DepartmentsModule,
    CashBookModule,
    CoursesModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
