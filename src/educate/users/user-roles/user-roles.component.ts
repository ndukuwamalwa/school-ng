import { Component, OnInit } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { NgForm } from '@angular/forms';
import { Role, ApplicationModule, ApplicationProcess, User } from 'src/models/models';
import { GET_ROLES_QUERY, GET_APPLICATION_MODULES_QUERY, GET_ROLE_PROCESS_AREAS, GET_ROLE_USERS_QUERY } from '../user.queries';
import { ConfirmationService, MessageService, PrimeIcons } from 'primeng/api';

@Component({
  selector: 'app-user-roles',
  templateUrl: './user-roles.component.html',
  styleUrls: ['./user-roles.component.scss'],
  providers: [MessageService]
})
export class UserRolesComponent implements OnInit {
  isSaving = false;
  roles: Array<Role> = [];
  showAreasPop = false;
  showUsersPop = false;
  currentRole: Role = null as any;
  showEditRole = false;
  applicationModules: Array<ApplicationModule> = [];
  roleProcessModules: Array<ApplicationModule> = [];
  originalRoleProcessModules: Array<ApplicationModule> = [];
  grant: Array<string> = [];
  revoke: Array<string> = [];
  users: Array<User> = [];

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

    this.apollo.query({
      query: GET_APPLICATION_MODULES_QUERY
    })
      .subscribe(res => {
        if (res.data) {
          this.applicationModules = (res.data as any).getApplicationModules;
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
      }],
      errorPolicy: 'all'
    })
      .subscribe(res => {
        this.isSaving = false;
        if (res.errors) {
          this.messageService.add({ severity: 'warn', summary: 'Failed', detail: 'Communication Failure' });
        } else {
          const result: boolean = (res.data as any).createUserRole;
          if (result) {
            form.reset();
          } else {
            this.messageService.add({ severity: 'warn', summary: 'Failed', detail: 'Encountered Problem when saving new role' });
          }
        }
      }, err => {
        this.messageService.add({ severity: 'warn', summary: 'Failed', detail: 'Communication Failure' });
        this.isSaving = false;
      });
  }

  private compileRoleProcesses(roleAreas: Array<ApplicationProcess>): void {
    const displayModules: Array<ApplicationModule> = [];
    this.applicationModules.forEach(mod => {
      const modAvailable = roleAreas.find(ra => ra.appModule.toLowerCase() === mod.shortDesc.toLowerCase());
      if (modAvailable) {
        displayModules.push({
          shortDesc: mod.shortDesc,
          description: mod.description,
          checked: true,
          processes: mod.processes.map(pa => ({
            ...pa,
            checked: roleAreas.find(ra => ra.shortDesc.toLowerCase() === pa.shortDesc.toLowerCase()) !== undefined,
            disabled: false
          }))
        });
      } else {
        displayModules.push({
          ...mod,
          checked: false,
          processes: mod.processes.map(pa => ({ ...pa, checked: false, disabled: true }))
        });
      }
    });

    this.roleProcessModules = displayModules;
    this.originalRoleProcessModules = JSON.parse(JSON.stringify(displayModules));
  }

  onViewAreas(role: Role): void {
    this.currentRole = role;
    this.showAreasPop = true;
    this.grant = [];
    this.revoke = [];
    this.apollo.query({
      query: GET_ROLE_PROCESS_AREAS(role.id),
      fetchPolicy: 'network-only'
    })
      .subscribe(res => {
        if (res.data) {
          this.compileRoleProcesses((res.data as any).getRoleProcessAreas);
        }
      });
  }

  onUsers(role: Role): void {
    this.currentRole = role;
    this.showUsersPop = true;
    this.getRoleUsers();
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
            this.messageService.add({ severity: 'warn', summary: 'Failed', detail: 'Failed to Edit Record' });
          } else {
            const success: boolean = (res.data as any).updateUserRole;
            if (success) {
              this.showEditRole = false;
              this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Changes Saved' });
            } else {
              this.messageService.add({ severity: 'warn', summary: 'Failed', detail: 'Failed to Edit Record' });
            }
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
              this.messageService.add({ severity: 'info', summary: 'Success', detail: 'Role Deleted Successfully' });
            }
          }, err => {
            this.messageService.add({ severity: 'warn', summary: 'Failed', detail: 'Communication Failure' });
          });
      }
    });
  }

  onModuleCheckChange(event: any, mod: ApplicationModule): void {
    const checked: boolean = event.checked;
    const selected = this.roleProcessModules.find(m => m.shortDesc.toLowerCase() === mod.shortDesc.toLowerCase());
    if (selected) {
      if (checked) {
        const old = this.originalRoleProcessModules.find(v => v.shortDesc === mod.shortDesc) as ApplicationModule;
        selected.processes = old?.processes.map(proc => ({ ...proc, disabled: false }));
        selected.processes.forEach(proc => {
          const grantIndex = this.grant.indexOf(proc.shortDesc);
          const revokeIndex = this.revoke.indexOf(proc.shortDesc);
          if (grantIndex > - 1) {
            this.grant.splice(grantIndex, 1);
          }

          if (revokeIndex > -1) {
            this.revoke.splice(revokeIndex, 1);
          }
        });
      } else {
        selected.processes = selected.processes.map(item => {
          if (item.checked) {
            this.revoke.push(item.shortDesc);
          }

          const grantIndex = this.grant.indexOf(item.shortDesc);
          if (grantIndex > -1) {
            this.grant.splice(grantIndex, 1);
          }

          return ({
            ...item,
            disabled: true,
            checked: false
          });
        });
      }
    }
  }

  grantRevoke({ checked }: { checked: boolean }, mod: ApplicationModule, process: ApplicationProcess): void {
    const old = this.originalRoleProcessModules.find(v => v.shortDesc === mod.shortDesc) as ApplicationModule;
    const oldProcess = old.processes.find(v => v.shortDesc === process.shortDesc) as ApplicationProcess;
    const grantIndex = this.grant.indexOf(process.shortDesc);
    const revokeIndex = this.revoke.indexOf(process.shortDesc);
    if (checked) {
      if (oldProcess.checked) {
        if (grantIndex > -1) {
          this.grant.splice(grantIndex, 1);
        }

        if (revokeIndex > -1) {
          this.revoke.splice(revokeIndex, 1);
        }
      } else {
        if (grantIndex < 0) {
          this.grant.push(process.shortDesc);
        }
      }
    } else {
      if (oldProcess.checked) {
        if (grantIndex > -1) {
          this.grant.splice(grantIndex, 1);
        }

        if (revokeIndex < 0) {
          this.revoke.push(process.shortDesc);
        }
      } else {
        if (revokeIndex > -1) {
          this.revoke.splice(revokeIndex, 1);
        }

        if (grantIndex > -1) {
          this.grant.splice(grantIndex, 1);
        }
      }
    }
  }

  saveProcessesChanges(): void {
    this.confirmationService.confirm({
      message: `Grant ${this.grant.length} and Revoke ${this.revoke.length} Processes to Role ${this.currentRole.name}?`,
      header: 'Confirm Action',
      icon: PrimeIcons.CHECK_SQUARE,
      accept: () => {
        this.apollo.mutate({
          mutation: gql`mutation m($grant: [String]!, $revoke: [String]!){
            alterRoleProcesses(role: ${this.currentRole.id}, grant: $grant, revoke: $revoke)
          }`,
          refetchQueries: [{ query: GET_ROLES_QUERY }],
          variables: { grant: this.grant, revoke: this.revoke }
        })
          .subscribe(res => {
            if (res.data) {
              const result = (res.data as any).alterRoleProcesses;
              if (result) {
                this.showAreasPop = false;
                this.grant = [];
                this.revoke = [];
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Changes Saved' });
              } else {
                this.messageService.add({ severity: 'warn', summary: 'Failed', detail: 'Role Modification Failed' });
              }
            }
          });
      }
    });
  }

  removeUser(user: User): void {
    this.confirmationService.confirm({
      message: `Remove ${user.username} from role ${this.currentRole.name}?`,
      header: 'Remove User',
      icon: PrimeIcons.EXCLAMATION_TRIANGLE,
      accept: () => {
        this.apollo.mutate({
          mutation: gql`mutation m{
            deassignUserFromRole(username: "${user.username}", role: ${this.currentRole.id})
          }`,
          refetchQueries: [{ query: GET_ROLES_QUERY }]
        })
          .subscribe(res => {
            if (res.errors) {
              this.messageService.add({ severity: 'warn', summary: 'Failed', detail: 'Failed to remove user' });
            } else {
              const success: boolean = (res.data as any).deassignUserFromRole;
              if (!success) {
                this.messageService.add({ severity: 'warn', summary: 'Failed', detail: 'Failed to remove user' });
              } else {
                this.getRoleUsers();
                this.messageService.add({ severity: 'success', summary: 'Success' });
              }
            }
          });
      }
    });
  }

  getRoleUsers(): void {
    this.apollo.query({
      query: GET_ROLE_USERS_QUERY(this.currentRole.id),
      fetchPolicy: 'network-only'
    })
      .subscribe(res => {
        if (res.data) {
          this.users = (res.data as any).getRoleUsers;
        }
      });
  }

  addUserToRole(form: NgForm): void {
    const username: string = form.value.username.toLowerCase();
    if (this.users.find(u => u.username.toLowerCase() === username)) {
      this.messageService.add({ severity: 'info', summary: 'Already Added', detail: `${username} is already added` });
      return;
    }
    this.isSaving = true;
    this.apollo.mutate({
      mutation: gql`mutation m{
        addUserToRole(role: ${this.currentRole.id}, username: "${username}")
      }`,
      refetchQueries: [{ query: GET_ROLES_QUERY }]
    })
      .subscribe(res => {
        this.isSaving = false;
        if (res.data) {
          const success: boolean = (res.data as any).addUserToRole;
          if (success) {
            this.getRoleUsers();
            form.reset();
            this.messageService.add({ severity: 'success', summary: 'Added Successfully' });
          } else {
            this.messageService.add({ severity: 'warn', summary: 'Addition Failed' });
          }
        }
      });
  }

}
