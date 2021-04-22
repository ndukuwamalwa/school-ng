import { Component, OnInit } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-user-roles',
  templateUrl: './user-roles.component.html',
  styleUrls: ['./user-roles.component.scss']
})
export class UserRolesComponent implements OnInit {
  isSaving = false;

  constructor(
    private apollo: Apollo
  ) { }

  ngOnInit(): void {
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
