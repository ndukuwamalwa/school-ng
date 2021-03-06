import { Component, OnInit, Input } from '@angular/core';
import { MenuItem, PrimeIcons } from 'primeng/api';
import { SessionService } from 'src/services/session.service';
import { User } from 'src/models/models';
import { StringEssentials } from 'src/essentials/string.essentials';
import { Router } from '@angular/router';

@Component({
  selector: 'app-educate-menu',
  templateUrl: './educate-menu.component.html',
  styleUrls: ['./educate-menu.component.scss']
})
export class EducateMenuComponent implements OnInit {
  items: Array<MenuItem> = [];
  displayName = '';
  user: User = {} as User;

  @Input() pageTitle = '';

  constructor(
    private sessionService: SessionService,
    private router: Router
  ) { }

  ngOnInit(): void {
    if (!this.pageTitle || this.pageTitle.trim().length === 0) {
      throw new Error('Page title cannot be blank');
    }

    this.user = this.sessionService.getUser();
    this.displayName = StringEssentials.titleCase(`${this.user.username} | ${this.user.staffNo}`);
    this.items = [
      {
        label: 'Courses',
        icon: PrimeIcons.BOOK,
        expanded: this.whenLinkIn(['/courses/list']),
        visible: this.sessionService.canAccessModule('COURSES'),
        items: [
          {
            label: 'List',
            icon: PrimeIcons.LIST,
            visible: this.sessionService.canAccessItem('COURSES.LIST'),
            routerLink: '/courses/list'
          }
        ]
      },
      {
        label: 'Students',
        icon: PrimeIcons.USER,
        visible: this.sessionService.canAccessModule('STUDENTS'),
        items: [
          {
            label: 'New',
            icon: PrimeIcons.PLUS,
            visible: this.sessionService.canAccessItem('STUDENTS.NEW')
          },
          {
            label: 'List',
            icon: PrimeIcons.LIST,
            visible: this.sessionService.canAccessItem('STUDENTS.LIST')
          }
        ]
      },
      {
        label: 'Subjects',
        icon: PrimeIcons.FILE,
        visible: this.sessionService.canAccessModule('SUBJECTS'),
        items: [
          {
            label: 'New',
            icon: PrimeIcons.PLUS,
            visible: this.sessionService.canAccessItem('SUBJECTS.NEW')
          },
          {
            label: 'List',
            icon: PrimeIcons.LIST,
            visible: this.sessionService.canAccessItem('SUBJECTS.LIST')
          }
        ]
      },
      {
        label: 'Instructors',
        icon: PrimeIcons.USER,
        visible: this.sessionService.canAccessModule('INSTRUCTORS'),
        items: [
          {
            label: 'New',
            icon: PrimeIcons.PLUS,
            visible: this.sessionService.canAccessItem('INSTRUCTORS.NEW')
          },
          {
            label: 'List',
            icon: PrimeIcons.LIST,
            visible: this.sessionService.canAccessItem('INSTRUCTORS.LIST')
          }
        ]
      },
      {
        label: 'Exams',
        icon: PrimeIcons.QUESTION,
        visible: this.sessionService.canAccessModule('EXAMINATIONS'),
        items: [
          {
            label: 'New',
            icon: PrimeIcons.PLUS,
            visible: this.sessionService.canAccessItem('EXAMINATIONS.NEW')
          },
          {
            label: 'List',
            icon: PrimeIcons.LIST,
            visible: this.sessionService.canAccessItem('EXAMINATIONS.LIST')
          }
        ]
      },
      {
        label: 'Fees',
        icon: PrimeIcons.DOLLAR,
        visible: this.sessionService.canAccessModule('FEES'),
        items: [
          {
            label: 'Setup',
            icon: PrimeIcons.COG,
            visible: this.sessionService.canAccessItem('FEES.SETUP')
          },
          {
            label: 'List',
            icon: PrimeIcons.LIST,
            visible: this.sessionService.canAccessItem('FEES.LIST')
          }
        ]
      },
      {
        label: 'Hostels',
        icon: PrimeIcons.FOLDER,
        visible: this.sessionService.canAccessModule('HOSTELS'),
        items: [
          {
            label: 'New',
            icon: PrimeIcons.PLUS,
            visible: this.sessionService.canAccessItem('HOSTELS.NEW')
          },
          {
            label: 'List',
            icon: PrimeIcons.LIST,
            visible: this.sessionService.canAccessItem('HOSTELS.LIST')
          }
        ]
      },
      {
        label: 'Cash Book',
        icon: PrimeIcons.DOLLAR,
        visible: this.sessionService.canAccessModule('CASHBOOK'),
        expanded: this.whenLinkIn(['/banks', '/banks/accounts']),
        items: [
          {
            label: 'Financial Accounts',
            icon: PrimeIcons.DOLLAR,
            visible: true,
            expanded: this.whenLinkIn(['/banks', '/banks/accounts']),
            items: [
              {
                label: 'Banks',
                icon: PrimeIcons.BRIEFCASE,
                visible: true,
                routerLink: '/banks'
              },
              {
                label: 'Institution Accounts',
                icon: PrimeIcons.BOOKMARK,
                visible: this.sessionService.canAccessItem('CASHBOOK.VIEW_BANK_ACCOUNTS'),
                routerLink: '/banks/accounts'
              }
            ]
          },
          {
            label: 'Transactions',
            icon: PrimeIcons.BOOK,
            visible: true,
            items: [
              {
                label: 'Receipts',
                icon: PrimeIcons.ARROW_DOWN,
                visible: this.sessionService.canAccessItem('CASHBOOK.FEE_RECEIPTS')
              },
              {
                label: 'Payments',
                icon: PrimeIcons.ARROW_UP,
                visible: this.sessionService.canAccessItem('CASHBOOK.PAYMENTS')
              }
            ]
          }
        ]
      },
      {
        label: 'General Ledger',
        icon: PrimeIcons.SORT_ALT,
        visible: this.sessionService.canAccessModule('GENERAL_LEDGER'),
        items: [
          {
            label: 'View Transactions',
            icon: PrimeIcons.MONEY_BILL,
            visible: this.sessionService.canAccessItem('GENERAL_LEDGER.VIEW_TRANSACTIONS')
          },
          {
            label: 'Journal Entries',
            icon: PrimeIcons.SLIDERS_H,
            visible: this.sessionService.canAccessItem('GENERAL_LEDGER.JOURNAL_ENTRIES')
          }
        ]
      },
      {
        label: 'Employees',
        icon: PrimeIcons.USERS,
        visible: this.sessionService.canAccessModule('EMPLOYEES'),
        expanded: this.whenLinkIn([
          '/employees/create'
        ]),
        items: [
          {
            label: 'List',
            icon: PrimeIcons.LIST,
            visible: this.sessionService.canAccessItem('EMPLOYEES.LIST'),
            routerLink: '/employees/list'
          }
        ]
      },
      {
        label: 'Users',
        icon: PrimeIcons.USER_PLUS,
        visible: this.sessionService.canAccessModule('USERS'),
        expanded: this.whenLinkIn([
          '/users/list', '/users/roles'
        ]),
        items: [
          {
            label: 'List',
            icon: PrimeIcons.LIST,
            visible: this.sessionService.canAccessItem('USERS.LIST'),
            routerLink: '/users/list'
          },
          {
            label: 'Access Roles',
            icon: PrimeIcons.LOCK,
            visible: this.sessionService.canAccessItem('USERS.ROLES'),
            routerLink: '/users/roles'
          }
        ]
      },
      {
        label: 'Departments',
        icon: PrimeIcons.BARS,
        visible: this.sessionService.canAccessModule('DEPARTMENTS'),
        expanded: this.whenLinkIn(['/departments/list']),
        items: [
          {
            label: 'List',
            icon: PrimeIcons.LIST,
            visible: true,
            routerLink: '/departments/list'
          }
        ]
      },
      {
        label: 'Settings',
        icon: PrimeIcons.COG,
        visible: this.sessionService.canAccessModule('SETTINGS'),
        items: [
          {
            label: 'Access',
            icon: PrimeIcons.LOCK,
            visible: this.sessionService.canAccessItem('SETTINGS.VIEW')
          }
        ]
      }
    ];
  }

  logout(): void {
    this.sessionService.logout();
  }

  whenLinkIn(links: Array<string>): boolean {
    if (links.indexOf(this.router.url) > -1) {
      return true;
    }
    return false;
  }

}
