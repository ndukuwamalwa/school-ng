import { Injectable } from '@angular/core';
import {
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { Apollo } from 'apollo-angular';
import { Bank } from 'src/models/models';
import { GET_BANK_WITH_BRANCHES } from 'src/educate/cash-book/cash-book.query';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BanksResolver implements Resolve<Array<Bank>> {
  constructor(
    private apollo: Apollo
  ) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Array<Bank>> {
    return this.apollo.query({ query: GET_BANK_WITH_BRANCHES, fetchPolicy: 'network-only' }).pipe(map(res => {
      if (res.data) {
        return (res.data as any).banks;
      } else {
        return [];
      }
    }));
  }
}
