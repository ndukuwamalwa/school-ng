import { Component, OnInit } from '@angular/core';
import { NameValue } from 'src/models/models';
import { CourseJourney } from 'src/models/course.models';
import { DataEssentials } from 'src/essentials/datatable.essentials';

@Component({
  selector: 'app-course-edit',
  templateUrl: './course-edit.component.html',
  styleUrls: ['./course-edit.component.scss']
})
export class CourseEditComponent extends DataEssentials implements OnInit {
  durationTypes: Array<NameValue> = [];
  departments: Array<NameValue> = [];
  selectedJourneys: Array<any> = [];
  journeys: Array<CourseJourney> = [];

  constructor() { 
    super();
  }

  ngOnInit(): void {
    this.durationTypes = [
      {
        name: 'Weeks',
        value: 'WEEKS'
      },
      {
        name: 'Months',
        value: 'MONTHS'
      },
      {
        name: 'Years',
        value: 'YEARS'
      }
    ];
  }

  newJourney() {

  }

  deleteJourneys() {

  }

}
