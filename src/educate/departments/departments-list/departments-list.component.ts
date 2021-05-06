import { Component, OnInit } from '@angular/core';
import { Department, Employee } from 'src/models/models';
import { MenuItem, PrimeIcons, MessageService, ConfirmationService } from 'primeng/api';
import { SessionService } from 'src/services/session.service';
import { NgForm } from '@angular/forms';
import { Apollo, gql } from 'apollo-angular';
import { GET_SELECTABLE_EMPLOYEES_QUERY } from 'src/educate/employees/employee.query';
import { DocumentNode } from 'graphql';
import { GET_DEPARTMENTS_QUERY } from '../departments.query';
import { GraphQLEssentials } from 'src/essentials/graphql.essentials';

@Component({
  selector: 'app-departments-list',
  templateUrl: './departments-list.component.html',
  styleUrls: ['./departments-list.component.scss']
})
export class DepartmentsListComponent implements OnInit {
  departments: Array<Department> = [];
  menu: Array<MenuItem> = [];
  showAddDepartment = false;
  action: 'Add' | 'Update' | '' = '';
  department: Department = undefined as any;
  employees: Array<Employee> = [];

  constructor(
    private sessionService: SessionService,
    private apollo: Apollo,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit(): void {
    this.menu = [
      {
        label: 'New',
        icon: PrimeIcons.PLUS_CIRCLE,
        visible: this.sessionService.canAccessItem('DEPARTMENTS.NEW'),
        command: () => {
          this.apollo.watchQuery({
            query: GET_SELECTABLE_EMPLOYEES_QUERY
          })
            .valueChanges
            .subscribe(res => {
              if (res.data) {
                const results: Array<Employee> = (res.data as any).employees;
                this.employees = results.map(e => ({ ...e, fullName: `${e.firstname} ${e.lastname}` }));
              }
            });
          this.action = 'Add';
          this.department = undefined as any;
          this.showAddDepartment = true;
        }
      }
    ];
    this.apollo.watchQuery({
      query: GET_DEPARTMENTS_QUERY
    })
      .valueChanges
      .subscribe(res => {
        if (res.data) {
          this.departments = (res.data as any).departments;
        }
      });
  }

  onSave(form: NgForm): void {
    const department: Department = form.value;
    const employee: Employee = form.value.hod;
    let mutation: DocumentNode;
    const endPoint = this.action === 'Add' ? 'addDepartment' : 'updateDepartment';
    mutation = gql`mutation m($department: DepartmentInput!) {
      ${endPoint}(department: $department) {
        message
        success
      }
    }`;
    if (this.action === 'Update') {
      department.id = this.department.id;
    }
    if (employee) {
      department.hod = employee.id;
    }

    this.apollo.mutate({
      mutation,
      variables: {
        department
      },
      refetchQueries: [{ query: GET_DEPARTMENTS_QUERY }]
    })
      .subscribe(res => {
        const result = GraphQLEssentials.handleMutationResponse(res, endPoint);
        this.messageService.add(result.message);
        if (result.success) {
          this.action = '';
          this.showAddDepartment = false;
        }
      });
  }

  onEdit(department: Department): void {
    this.department = department;
    this.action = 'Update';
    this.showAddDepartment = true;
  }

  confirmDelete(department: Department): void {
    this.confirmationService.confirm({
      header: 'Delete Department',
      message: `Are you sure you want to delete department ${department.name}?`,
      icon: PrimeIcons.EXCLAMATION_TRIANGLE,
      accept: () => {
        this.apollo.mutate({
          mutation: gql`mutation m {
            deleteDepartment(id: ${department.id}) {
              message
              success
            }
          }`,
          refetchQueries: [{ query: GET_DEPARTMENTS_QUERY }]
        })
        .subscribe(res => {
          const result = GraphQLEssentials.handleMutationResponse(res, 'deleteDepartment');
          this.messageService.add(result.message);
        });
      }
    });
  }

}
