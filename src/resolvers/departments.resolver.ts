import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { Apollo } from 'apollo-angular';
import { GET_DEPARTMENTS_QUERY } from 'src/educate/departments/departments.query';
import { map } from 'rxjs/operators';
import { Department } from 'src/models/models';

@Injectable({
  providedIn: 'root'
})
export class DepartmentsResolver implements Resolve<Array<Department>> {
  constructor(
    private apollo: Apollo
  ) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Array<Department>> {
    return this.apollo.query({ query: GET_DEPARTMENTS_QUERY, fetchPolicy: 'network-only' })
    .pipe(map(res => {
      if (res.data) {
        return (res.data as any).departments;
      } else {
        return [];
      }
    }));
  }
}
