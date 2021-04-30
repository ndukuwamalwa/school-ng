import { Component, OnInit } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { NgForm } from '@angular/forms';
import { Role } from 'src/models/models';
import { GET_ROLES_QUERY } from '../user.queries';
import { ConfirmationService, MessageService, PrimeIcons } from 'primeng/api';

@Component({
  selector: 'app-user-roles',
  templateUrl: './user-roles.component.html',
  styleUrls: ['./user-roles.component.scss']
})
export class UserRolesComponent implements OnInit {
  isSaving = false;
  roles: Array<Role> = [];
  showAreasPop = false;
  showUsersPop = false;
  currentRole: Role = null as any;
  showEditRole = false;

  constructor(
    private apollo: Apollo,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.apollo.watchQuery({
      query: GET_ROLES_QUERY,
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
      refetchQueries: [{
        query: GET_ROLES_QUERY
      }]
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

  onViewAreas(role: Role): void {
    this.currentRole = role;
    this.showAreasPop = true;
  }

  onUsers(role: Role): void {
    this.currentRole = role;
    this.showUsersPop = true;
  }

  onEditRole(role: Role): void {
    this.currentRole = role;
    this.showEditRole = true;
  }

  editRole(newName: string): void {
    if (!newName || newName.trim().length === 0) {
      return;
    }
    if (newName.toLowerCase() === this.currentRole.name.toLowerCase()) {
      this.showEditRole = false;
    } else {
      this.apollo.mutate({
        mutation: gql`mutation m{
          updateUserRole(role: ${this.currentRole.id}, newName: "${newName}")
        }`,
        refetchQueries: [
          {
            query: GET_ROLES_QUERY
          }
        ]
      })
      .subscribe(res => {
        if (res.errors) {

        } else {
          this.showEditRole = false;
        }
      });
    }
  }

  askDeleteRole(role: Role): void {
    this.confirmationService.confirm({
      message: `Delete role '${role.name}' and revoke access to system areas for ${role.userCount} user(s)?`,
      header: `Confirm Deletion`,
      icon: PrimeIcons.EXCLAMATION_TRIANGLE,
      accept: () => {
        this.apollo.mutate({
          mutation: gql`mutation m{
            deleteUserRole(role: ${role.id})
          }`,
          refetchQueries: [{
            query: GET_ROLES_QUERY
          }],
          errorPolicy: 'none'
        })
        .subscribe(res => {
          if (res.errors) {
            this.messageService.add({ severity: 'info', summary: 'Failed', detail: 'Failed to Delete Record' });
          } else {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Role Deleted Successfully' });
          }
        }, err => {
          this.messageService.add({ severity: 'info', summary: 'Failed', detail: 'Communication Failure' });
        });
      }
    });
  }

}
