import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {NavComponent} from "./nav/nav.component";
import {ClassListComponent} from "./class-list/class-list.component";
import {DashboardComponent} from "./dashboard/dashboard.component";
import {StudentsListComponent} from "./students-list/students-list.component";
import {AddStudentComponent} from "./add-student/add-student.component";
import {AddAttendanceComponent} from "./attendance/add-attendance/add-attendance.component";
import {AttendanceListComponent} from "./attendance/attendance-list/attendance-list.component";
import {LoginComponent} from "./login/login.component";
import {AuthGuard} from "./services/auth.guard";
import {UsersListComponent} from "./users/users-list/users-list.component";
import {TestListComponent} from "./tests/test-list/test-list.component";
import {AddTestComponent} from "./tests/add-test/add-test.component";
import {EditTestComponent} from "./tests/edit-test/edit-test.component";
import {MessagesComponent} from "./messages/messages.component";
import {StudentAttendanceComponent} from "./attendance/student-attendance/student-attendance.component";
import {GalleryComponent} from "./gallery/gallery.component";
import {BulkDataUploadComponent} from "./bulk-data-upload/bulk-data-upload.component";
import {SliderListComponent} from "./slider-list/slider-list.component";
import {HomeComponent} from "./home/home.component";
import {PrivacyPolicyComponent} from "./privacy-policy/privacy-policy.component";
import {DeleteDataComponent} from "./delete-data/delete-data.component";
import {AddAssignmentComponent} from "./assignements/add-assignment/add-assignment.component";
import {AssignmentTableComponent} from "./assignements/assignment-table/assignment-table.component";

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
      {path:'home',
      component:HomeComponent,
      canActivate:[AuthGuard],
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
        path: 'messages',
        component: MessagesComponent,
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
        path:'student-attendance/:id',
        component:StudentAttendanceComponent,
        canActivate:[AuthGuard]
      },
      {
        path: 'attendance',
        component: AttendanceListComponent,
        canActivate: [AuthGuard],

      },
      {
        path: 'gallery',
        component: GalleryComponent,
        canActivate: [AuthGuard],

      },
      {
        path: 'upload',
        component: BulkDataUploadComponent,
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
        path: 'sliders',
        component: SliderListComponent,
        canActivate: [AuthGuard],

      },
      {
        path: 'add-test',
        component: AddTestComponent,
        canActivate: [AuthGuard],

      },
      { path: 'edit-test/:testId', component: EditTestComponent },
      {path:'add-assignment',
      component:AddAssignmentComponent
      },
      {path:'assignments',
        component:AssignmentTableComponent
      }

    ],
  },
  { path: 'login', component: LoginComponent },
  {
    path: 'privacy-policy',
    component: PrivacyPolicyComponent
  },
  {
    path: 'delete-data',
    component: DeleteDataComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
