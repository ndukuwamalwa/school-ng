import { Component, OnInit } from '@angular/core';
import { Department } from 'src/models/models';

@Component({
  selector: 'app-departments-list',
  templateUrl: './departments-list.component.html',
  styleUrls: ['./departments-list.component.scss']
})
export class DepartmentsListComponent implements OnInit {
  departments: Array<Department> = [];

  constructor() { }

  ngOnInit(): void {
  }

  onViewCourses(department: Department): void {

  }

  onViewMembers(department: Department): void {

  }

}
