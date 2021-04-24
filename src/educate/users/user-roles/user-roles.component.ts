import { Component, OnInit } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { NgForm } from '@angular/forms';
import { Role } from 'src/models/models';

@Component({
  selector: 'app-user-roles',
  templateUrl: './user-roles.component.html',
  styleUrls: ['./user-roles.component.scss']
})
export class UserRolesComponent implements OnInit {
  isSaving = false;
  roles: Array<Role> = [];

  constructor(
    private apollo: Apollo
  ) { }

  ngOnInit(): void {
    this.apollo.watchQuery({
      query: gql`{
        getSystemRoles {
          name
          createdOn
          createdBy
          accessAreasCount
          accessPercentage
          userCount
        }
      }`,
      errorPolicy: 'all'
    })
    .valueChanges
    .subscribe(res => {
      if (res.data) {
        this.roles = (res.data as any).getSystemRoles;
      }
    });
  }

  saveRole(form: NgForm): void {
    this.isSaving = true;
    this.apollo.mutate({
      mutation: gql`
      mutation m {
        createUserRole(role: "${form.value.name}")
      }`,
      refetchQueries: []
    })
      .subscribe(res => {
        this.isSaving = false;
        if (res.errors) {

        } else {
          form.reset();
        }
      }, err => {
        this.isSaving = false;
      });
  }

}
