import { Component, OnInit } from '@angular/core';
import { MenuItem, MessageService, ConfirmationService, PrimeIcons } from 'primeng/api';
import { SessionService } from 'src/services/session.service';
import { Apollo, gql } from 'apollo-angular';
import { NgForm } from '@angular/forms';
import { Employee, Department, KeyValue, Bank, BankBranch } from 'src/models/models';
import { GET_EMPLOYEES } from '../employee.query';
import { GraphQLEssentials } from 'src/essentials/graphql.essentials';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.scss']
})
export class EmployeeListComponent implements OnInit {
  menu: Array<MenuItem> = [];
  action: 'Add' | 'Update' | '' = '';
  showAddEmployee = false;
  currentEmployee: Employee = undefined as any;
  selectedDepartment: Department = undefined as any;
  genders: Array<KeyValue> = [];
  idTypes: Array<KeyValue> = [];
  banks: Array<Bank> = [];
  bankBranches: Array<BankBranch> = [];
  bankBranchPlaceholder = 'Select bank first';
  selectedBank: Bank = undefined as any;
  academicLevels: Array<KeyValue> = [];
  departments: Array<Department> = [];
  employees: Array<Employee> = [];

  constructor(
    private sessionService: SessionService,
    private apollo: Apollo,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.menu = [
      {
        label: 'New',
        icon: PrimeIcons.PLUS_CIRCLE,
        visible: this.sessionService.canAccessItem('EMPLOYEES.ADD'),
        command: () => {
          this.showAddEmployee = true;
          this.action = 'Add';
        }
      }
    ];
    this.apollo.watchQuery({
      query: GET_EMPLOYEES(null as any)
    })
      .valueChanges
      .subscribe(res => {
        if (res.data) {
          this.employees = (res.data as any).employees;
        }
      });

    this.genders = [
      {
        name: 'Male',
        value: 'Male'
      },
      {
        name: 'Female',
        value: 'Female'
      }
    ];
    this.idTypes = [
      {
        name: 'National ID',
        value: 'National ID'
      },
      {
        name: 'Passport',
        value: 'Passport'
      }
    ];
    this.academicLevels = [
      {
        name: 'Primary School',
        value: 'Primary School'
      },
      {
        name: 'Secondary/High School',
        value: 'Secondary School'
      },
      {
        name: 'College Certificate',
        value: 'College Certificate'
      },
      {
        name: 'Diploma',
        value: 'Diploma'
      },
      {
        name: 'Degree',
        value: 'Degree'
      },
      {
        name: 'Masters',
        value: 'Masters'
      },
      {
        name: 'Doctorate and Above',
        value: 'Doctorate and Above'
      }
    ];

    this.route.data.subscribe(data => {
      this.banks = data.banks;
      this.departments = data.departments;
    });
  }

  saveEmployee(form: NgForm): void {
    const employee: Employee = form.value;
    if (!employee.gender) {
      document.getElementById('gender')?.focus();
      return;
    }
    if (!employee.idType) {
      document.getElementById('idType')?.focus();
      return;
    }
    if (employee.nextOfKinId) {
      if (!employee.nextOfKinIdType) {
        document.getElementById('nextOfKinIdType')?.focus();
        return;
      }
    }
    if (!employee.educationLevel) {
      document.getElementById('educationLevel')?.focus();
      return;
    }
    if (!employee.department) {
      document.getElementById('department')?.focus();
      return;
    }
    if (employee.accNo) {
      if (!(employee as any).bank) {
        document.getElementById('bank')?.focus();
        return;
      }
      if (!employee.bankBranch) {
        document.getElementById('bankBranch')?.focus();
        return;
      }
    }
    delete (employee as any).bank;
    if (employee.bankBranch) {
      employee.bankBranch = +employee.bankBranch;
    }
    if (employee.department) {
      employee.department = +employee.department;
    }
    let rpc = 'addEmployee';
    if (this.action === 'Update') {
      employee.id = this.currentEmployee.id;
      rpc = 'updateEmployee';
    }
    this.apollo.mutate({
      mutation: gql`mutation m($employee: EmployeeInput!) {
        ${rpc}(employee: $employee) {
          success
          message
        }
      }`,
      refetchQueries: [{ query: GET_EMPLOYEES(null as any) }],
      variables: {
        employee
      }
    })
      .subscribe(res => {
        const result = GraphQLEssentials.handleMutationResponse(res, rpc);
        this.messageService.add(result.message);
        if (result.success) {
          form.reset();
          this.showAddEmployee = false;
        }
      });
  }

  onBankSelected({ value }: { value: Bank }): void {
    this.bankBranches = value.branches;
    this.selectedBank = value;
    this.bankBranchPlaceholder = 'Select branch';
  }

  onEditEmployee(employee: Employee): void {

  }

  onDeleteEmployee(employee: Employee): void {

  }

}
