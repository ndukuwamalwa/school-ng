import { Component, OnInit } from '@angular/core';
import { MenuItem, PrimeIcons, ConfirmationService, MessageService } from 'primeng/api';
import { User, ApplicationModule, ApplicationProcess, Role } from 'src/models/models';
import { Apollo, gql } from 'apollo-angular';
import { GET_USERS_QUERY, GET_APPLICATION_MODULES_QUERY, GET_USER_AREAS, GET_ROLES_QUERY } from '../user.queries';
import { NgForm } from '@angular/forms';
import { GraphQLEssentials } from 'src/essentials/graphql.essentials';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
  providers: [MessageService]
})
export class UserListComponent implements OnInit {
  menu: Array<MenuItem> = [];
  users: Array<User> = [];
  showAreasPop = false;
  grant: Array<string> = [];
  revoke: Array<string> = [];
  currentUser: User = null as any;
  applicationModules: Array<ApplicationModule> = [];
  userProcessModules: Array<ApplicationModule> = [];
  userRoleProcesses: Array<string> = [];
  userUserProcesses: Array<string> = [];
  isSaving = false;
  showCreateUser = false;
  roles: Array<Role> = [];
  selectedRole: Role = null as any;

  constructor(
    private apollo: Apollo,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.menu = [
      {
        label: 'New',
        icon: PrimeIcons.USER_PLUS,
        command: () => {
          this.apollo.watchQuery({
            query: GET_ROLES_QUERY
          })
            .valueChanges
            .subscribe(res => {
              if (res.data) {
                this.roles = (res.data as any).getSystemRoles;
              }
            });
          this.showCreateUser = true;
        }
      },
      {
        label: 'Refresh',
        icon: PrimeIcons.REFRESH,
        command: () => this.apollo.query({ query: GET_USERS_QUERY, fetchPolicy: 'network-only' }).subscribe(res => {
          this.users = (res.data as any).users;
        })
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

    this.apollo.query({
      query: GET_APPLICATION_MODULES_QUERY
    })
      .subscribe(res => {
        if (res.data) {
          this.applicationModules = (res.data as any).getApplicationModules;
        }
      });
  }

  onDeleteUser(user: User): void {
    this.confirmationService.confirm({
      header: `Delete '${user.username}'`,
      message: `Delete user ${user.username}?`,
      icon: PrimeIcons.EXCLAMATION_TRIANGLE,
      accept: () => {
        this.apollo.mutate({
          mutation: gql`mutation m {
            deleteUser(username: "${user.username}") {
              success
              message
            }
          }`,
          refetchQueries: [{ query: GET_USERS_QUERY }]
        })
          .subscribe(res => {
            const result = GraphQLEssentials.handleMutationResponse(res, 'deleteUser');
            this.messageService.add(result.message);
          });
      }
    });
  }

  toggleUserStatus(user: User, enable: boolean): void {
    this.confirmationService.confirm({
      header: enable ? `Enable ${user.username}` : `Disable ${user.username}`,
      message: `Are you sure you want to ${enable ? 'enable' : 'disable'} user ${user.username}?`,
      icon: PrimeIcons.EXCLAMATION_TRIANGLE,
      accept: () => {
        this.apollo.mutate({
          mutation: gql`mutation m {
            toggleUserStatus(username: "${user.username}", enable: ${enable}) {
              success
              message
            }
          }`,
          refetchQueries: [{ query: GET_USERS_QUERY }]
        })
          .subscribe(res => {
            const result = GraphQLEssentials.handleMutationResponse(res, 'toggleUserStatus');
            this.messageService.add(result.message);
          });
      }
    });
  }

  private showUserAreas({ roleBased, userBased }: { roleBased: Array<string>, userBased: Array<string> }): void {
    this.userRoleProcesses = roleBased;
    this.userUserProcesses = userBased;
    const displayModules: Array<ApplicationModule> = [];
    roleBased = roleBased.map(rb => rb.toUpperCase());
    userBased = userBased.map(ub => ub.toUpperCase());

    this.applicationModules.forEach(mod => {
      const appModule: ApplicationModule = {
        shortDesc: mod.shortDesc,
        description: mod.description,
        checked: false,
        processes: mod.processes,
        disabled: true
      };

      let hasModuleAccess = roleBased.some(v => v.split('.')[0] === mod.shortDesc);

      if (hasModuleAccess) {
        appModule.checked = true;
        appModule.disabled = true;
      } else {
        hasModuleAccess = userBased.some(v => v.split('.')[0] === mod.shortDesc);

        if (hasModuleAccess) {
          appModule.checked = true;
          appModule.disabled = false;
        } else {
          appModule.checked = false;
          appModule.disabled = false;
        }
      }

      appModule.processes = appModule.processes.map(process => {
        const inRole = roleBased.includes(process.shortDesc);
        const inUser = userBased.includes(process.shortDesc);
        const proc: ApplicationProcess = JSON.parse(JSON.stringify(process));
        if (inRole) {
          proc.checked = true;
          proc.disabled = true;
        } else {
          if (inUser) {
            proc.checked = true;
            proc.disabled = false;
          } else {
            proc.checked = false;
            proc.disabled = false;
          }
        }

        return proc;
      });

      displayModules.push(appModule);
    });

    this.userProcessModules = displayModules;
  }

  private clearPanel(): void {
    this.grant = [];
    this.revoke = [];
    this.userRoleProcesses = [];
    this.userUserProcesses = [];
    this.userProcessModules = [];
  }

  showAccessAreas(user: User): void {
    this.currentUser = user;
    this.showAreasPop = true;
    this.clearPanel();
    this.apollo.query({
      query: GET_USER_AREAS(user.username),
      fetchPolicy: 'network-only'
    })
      .subscribe(res => {
        if (res.data) {
          this.showUserAreas((res.data as any).getUserProcessAreas);
        }
      });
  }

  grantRevoke({ checked }: { checked: boolean }, mod: ApplicationModule, process: ApplicationProcess): void {
    const grantIndex = this.grant.indexOf(process.shortDesc);
    const revokeIndex = this.revoke.indexOf(process.shortDesc);
    const roleIndex = this.userRoleProcesses.indexOf(process.shortDesc);
    const userIndex = this.userUserProcesses.indexOf(process.shortDesc);

    if (roleIndex > - 1) {
      // Don't modify role processes
      return;
    }

    if (checked) {
      if (grantIndex < 0 && userIndex < 0 && roleIndex < 0) {
        this.grant.push(process.shortDesc);
      }

      if (revokeIndex > -1) {
        this.revoke.splice(revokeIndex, 1);
      }
    } else {
      if (revokeIndex < 0 && (roleIndex > -1 || userIndex > -1)) {
        this.revoke.push(process.shortDesc);
      }

      if (grantIndex > -1) {
        this.grant.splice(grantIndex, 1);
      }
    }
  }

  saveProceses(): void {
    this.confirmationService.confirm({
      header: `Confirm Action`,
      message: `Grant ${this.grant.length} and Revoke ${this.revoke.length} roles to ${this.currentUser.username}?`,
      icon: PrimeIcons.EXCLAMATION_TRIANGLE,
      accept: () => {
        this.isSaving = true;
        this.apollo.mutate({
          mutation: gql`mutation m($grant: [String]!, $revoke: [String]!) {
            alterUserProcesses(username: "${this.currentUser.username}", grant: $grant, revoke: $revoke) {
              success
              message
            }
          }`,
          variables: {
            grant: this.grant,
            revoke: this.revoke
          },
          refetchQueries: [{ query: GET_USERS_QUERY }]
        })
          .subscribe(res => {
            this.isSaving = false;
            const result = GraphQLEssentials.handleMutationResponse(res, 'alterUserProcesses');
            this.messageService.add(result.message);
            if (result.success) {
              this.showAreasPop = false;
              this.clearPanel();
            }
          });
      }
    });
  }

  createUser(form: NgForm): void {
    const { staffNo, role }: { staffNo: string, role: Role } = form.value;
    const roleId: number | null = role ? role.id : null;
    this.apollo.mutate({
      mutation: gql`mutation m {
        createUser(staffNo: "${staffNo}", role: ${roleId}) {
          success
          message
        }
      }`,
      refetchQueries: [{ query: GET_USERS_QUERY }]
    })
    .subscribe(res => {
      const response = GraphQLEssentials.handleMutationResponse(res, 'createUser');
      this.messageService.add(response.message);
      if (response.success) {
        this.showCreateUser = false;
      }
    });
  }

}
