import { Component, OnInit } from '@angular/core';
import { MenuItem, PrimeIcons } from 'primeng/api';
import { User } from 'src/models/models';
import { Apollo } from 'apollo-angular';
import { GET_USERS_QUERY } from '../user.queries';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
  menu: Array<MenuItem> = [];
  users: Array<User> = [];

  constructor(
    private apollo: Apollo
  ) { }

  ngOnInit(): void {
    this.menu = [
      {
        label: 'New',
        icon: PrimeIcons.USER_PLUS
      }
    ];

    this.apollo.watchQuery({
      query: GET_USERS_QUERY
    })
    .valueChanges
    .subscribe(res => {
      if (res.data) {
        this.users = (res.data as any).users;
      }
    });
  }

}
