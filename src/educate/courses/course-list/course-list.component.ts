import { Component, OnInit } from '@angular/core';
import { MenuItem, PrimeIcons, ConfirmationService, MessageService } from 'primeng/api';
import { SessionService } from 'src/services/session.service';
import { Course, Department, CourseJourney, KeyValue } from 'src/models/models';
import { Apollo, gql } from 'apollo-angular';
import { GET_COURSES_QUERY } from '../courses.query';
import { ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DocumentNode } from 'graphql';
import { GraphQLEssentials } from 'src/essentials/graphql.essentials';

@Component({
  selector: 'app-course-list',
  templateUrl: './course-list.component.html',
  styleUrls: ['./course-list.component.scss']
})
export class CourseListComponent implements OnInit {
  menu: Array<MenuItem> = [];
  courses: Array<Course> = [];
  departments: Array<Department> = [];
  showAddCourse = false;
  courseAction: 'Add' | 'Update' | '' = '';
  currentCourse: Course = undefined as any;
  showStepsPop = false;
  courseSteps: Array<CourseJourney> = [];
  durations: Array<KeyValue> = [];
  journeys: Array<CourseJourney> = [];

  constructor(
    private sessionService: SessionService,
    private apollo: Apollo,
    private route: ActivatedRoute,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.menu = [
      {
        label: 'New',
        icon: PrimeIcons.PLUS,
        visible: this.sessionService.canAccessItem('COURSES.NEW'),
        command: () => {
          this.currentCourse = undefined as any;
          this.showAddCourse = true;
          this.courseAction = 'Add';
        }
      }
    ];
    this.apollo.watchQuery({
      query: GET_COURSES_QUERY()
    })
      .valueChanges
      .subscribe(res => {
        this.courses = (res.data as any).courses;
      });

    this.route.data.subscribe(data => {
      this.departments = data.departments;
    });

    this.durations = [
      {
        name: 'Months',
        value: 'Months'
      },
      {
        name: 'Years',
        value: 'Years'
      }
    ];
  }

  saveCourse(form: NgForm): void {
    const course: Course = form.value;
    if (!course.department) {
      document.getElementById('department')?.focus();
      return;
    }
    if (!course.durationIn) {
      document.getElementById('durationIn')?.focus();
      return;
    }
    let mutation: DocumentNode;
    let endPoint = 'addCourses';
    if (this.courseAction === 'Add') {
      mutation = gql`mutation m ($course: CourseInput!) {
        addCourses(courses: [$course]) {
          success
          message
        }
      }`;
    } else {
      course.id = this.currentCourse.id;
      endPoint = 'updateCourse';
      mutation = gql`mutation m($course: CourseInput!) {
        updateCourse(course: $course) {
          success
          message
        }
      }`;
    }
    this.apollo.mutate({
      mutation,
      refetchQueries: [{ query: GET_COURSES_QUERY() }],
      variables: {
        course
      }
    })
      .subscribe(res => {
        const result = GraphQLEssentials.handleMutationResponse(res, endPoint);
        this.messageService.add(result.message);
        if (result.success) {
          this.showAddCourse = false;
          form.reset();
          this.courseAction = '';
        }
      });
  }

  deleteCourse(course: Course): void {
    this.confirmationService.confirm({
      header: 'Delete Course',
      message: `Delete ${course.name}?`,
      icon: PrimeIcons.EXCLAMATION_TRIANGLE,
      accept: () => {
        this.apollo.mutate({
          mutation: gql`mutation m {
            deleteCourse(id: ${course.id}) {
              message
              success
            }
          }`,
          refetchQueries: [{ query: GET_COURSES_QUERY() }]
        })
          .subscribe(res => {
            const result = GraphQLEssentials.handleMutationResponse(res, 'deleteCourse');
            this.messageService.add(result.message);
          });
      }
    });
  }

  onEditCourse(course: Course): void {
    this.currentCourse = course;
    this.courseAction = 'Update';
    this.showAddCourse = true;
  }

  onShowCourseSteps(course: Course): void {
    this.currentCourse = course;
    this.courseSteps = course.journeys;
    this.showStepsPop = true;
  }

  onSaveSteps(form: NgForm): void {
    const steps: Array<CourseJourney> = [];
    const value = form.value;
    const totalSteps = +value.stepsCount;
    if (totalSteps === 0) {
      document.getElementById('stepsCount')?.focus();
      return;
    }
    for (let i = 1; i <= totalSteps; i++) {
      steps.push({
        id: null as any,
        course: +this.currentCourse.id,
        level: i,
        terms: +value['terms' + i]
      });
    }
    this.apollo.mutate({
      mutation: gql`mutation m($data: [CourseJourneyInput!]!) {
        addCourseJourneys(course: ${this.currentCourse.id}, journeys: $data) {
          success
          message
        }
      }`,
      refetchQueries: [{ query: GET_COURSES_QUERY() }],
      variables: {
        data: steps
      }
    })
      .subscribe(res => {
        const result = GraphQLEssentials.handleMutationResponse(res, 'addCourseJourneys');
        this.messageService.add(result.message);
        if (result.success) {
          this.showStepsPop = false;
        }
      });
  }

  onStepsCountChange(steps: number): void {
    this.journeys = [];
    for (let i = 1; i <= +steps; i ++) {
      this.journeys.push({
        id: 1,
        level: i,
        course: this.currentCourse.id,
        terms: 1
      });
    }
  }

}
