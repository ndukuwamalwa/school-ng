import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { PortalModule } from 'src/portal/portal.module';
import { CoursesModule } from 'src/courses/courses.module';
import { GraphQLModule } from './graphql.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptor } from 'src/interceptors/token.interceptor';
import { TicketsModule } from 'src/educate/tickets/tickets.module';
import { UsersModule } from 'src/educate/users/users.module';
import { EmployeesModule } from 'src/educate/employees/employees.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    PortalModule,
    CoursesModule,
    GraphQLModule,
    HttpClientModule,
    TicketsModule,
    UsersModule,
    EmployeesModule
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
