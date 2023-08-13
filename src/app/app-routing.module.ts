import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {NavComponent} from "./nav/nav.component";
import {ClassListComponent} from "./class-list/class-list.component";
import {DashboardComponent} from "./dashboard/dashboard.component";
import {StudentsListComponent} from "./students-list/students-list.component";
import {AddStudentComponent} from "./add-student/add-student.component";
import {AddAttendanceComponent} from "./add-attendance/add-attendance.component";
import {AttendanceListComponent} from "./attendance-list/attendance-list.component";
import {LoginComponent} from "./login/login.component";
import {AuthGuard} from "./services/auth.guard";
import {UsersListComponent} from "./users/users-list/users-list.component";
import {TestListComponent} from "./tests/test-list/test-list.component";
import {AddTestComponent} from "./tests/add-test/add-test.component";
import {EditTestComponent} from "./tests/edit-test/edit-test.component";

const routes: Routes = [

  {
    path: '',

    component: NavComponent,
    // component: NavigationComponent,
    // canActivate: [AuthGuard],
    children: [

      {
        path: '',
        redirectTo:'class-list',

        pathMatch: 'full',
        // component: ClassListComponent,
        // canActivate: [AuthGuard],

      },
      {
        path: 'class-list',
        component: ClassListComponent,
        canActivate: [AuthGuard],

      },
      {
        path: 'student-list',
        component: StudentsListComponent,
        canActivate: [AuthGuard],

      },
      {
        path: 'add-student',
        component: AddStudentComponent,
        canActivate: [AuthGuard],

      },
      {
        path: 'add-attendance',
        component: AddAttendanceComponent,
        canActivate: [AuthGuard],

      },
      {
        path: 'attendance',
        component: AttendanceListComponent,
        canActivate: [AuthGuard],

      },
      {
        path: 'users',
        component: UsersListComponent,
        canActivate: [AuthGuard],

      },
      {
        path: 'tests',
        component: TestListComponent,
        canActivate: [AuthGuard],

      },
      {
        path: 'add-test',
        component: AddTestComponent,
        canActivate: [AuthGuard],

      },
      { path: 'edit-test/:testId', component: EditTestComponent }
    ],
  },
  { path: 'login', component: LoginComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
