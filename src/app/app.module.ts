import {ENVIRONMENT_INITIALIZER, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {initializeApp, provideFirebaseApp} from '@angular/fire/app';
import {environment} from '../environments/environment';
import {provideAnalytics, getAnalytics, ScreenTrackingService, UserTrackingService} from '@angular/fire/analytics';
import {provideAuth, getAuth, connectAuthEmulator} from '@angular/fire/auth';
import {provideDatabase, getDatabase, connectDatabaseEmulator} from '@angular/fire/database';
import {provideFirestore, getFirestore, connectFirestoreEmulator} from '@angular/fire/firestore';
import {FIREBASE_OPTIONS} from "@angular/fire/compat";
import {NavComponent} from './nav/nav.component';
import {LayoutModule} from '@angular/cdk/layout';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatIconModule} from '@angular/material/icon';
import {MatListModule} from '@angular/material/list';
import {DashboardComponent} from './dashboard/dashboard.component';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatCardModule} from '@angular/material/card';
import {MatMenuModule} from '@angular/material/menu';
import {ClassListComponent} from './class-list/class-list.component';
import {RouterLink, RouterOutlet} from "@angular/router";
import {AppRoutingModule} from "./app-routing.module";
import {AddClassComponent} from './add-class/add-class.component';
import {MatDialog, MatDialogModule} from "@angular/material/dialog";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatSelectModule} from "@angular/material/select";
import {MatInputModule} from "@angular/material/input";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {MatTableModule} from "@angular/material/table";
import {initializeDialogService} from "../main";
import {StudentsListComponent} from './students-list/students-list.component';
import {AddStudentComponent} from './add-student/add-student.component';
import {AddAttendanceComponent} from './attendance/add-attendance/add-attendance.component';
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatRadioModule} from "@angular/material/radio";
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatRippleModule} from "@angular/material/core";
import {CustomDateAdapter, MY_DATE_FORMATS} from "./CustomDateAdapter";
import {PrettyJsonModule} from "angular2-prettyjson";
import {DatePipe, NgOptimizedImage} from "@angular/common";
import {AttendanceListComponent} from './attendance/attendance-list/attendance-list.component';
import {LoginComponent} from './login/login.component';
import {AuthGuard} from "./services/auth.guard";
import { UsersListComponent } from './users/users-list/users-list.component';
import { StudentListComponent } from './users/users-list/student-list/student-list.component';
import { ParentListComponent } from './users/users-list/parent-list/parent-list.component';
import {MatTabsModule} from "@angular/material/tabs";
import { TestListComponent } from './tests/test-list/test-list.component';
import { AddTestComponent } from './tests/add-test/add-test.component';
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import { EditTestComponent } from './tests/edit-test/edit-test.component';
import { MessagesComponent } from './messages/messages.component';
import { StudentAttendanceComponent } from './attendance/student-attendance/student-attendance.component';
import {MatSortModule} from "@angular/material/sort";
import {MatPaginatorModule} from "@angular/material/paginator";
import { AddMessageComponent } from './messages/add-message/add-message.component';
import { SendUserMessageComponent } from './messages/send-user-message/send-user-message.component';
import { SendImageMessageComponent } from './messages/send-image-message/send-image-message.component';
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {MaterialFileInputModule} from "ngx-material-file-input";
import { GalleryComponent } from './gallery/gallery.component';
import { AddGalleryComponent } from './gallery/add-gallery/add-gallery.component';
import {BulkDataUploadComponent} from "./bulk-data-upload/bulk-data-upload.component";
import {HttpClientModule} from "@angular/common/http";
import { SliderListComponent } from './slider-list/slider-list.component';
import { AddSliderComponent } from './slider-list/add-slider/add-slider.component';
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import { HomeComponent } from './home/home.component';
import { HomeCardComponent } from './home-card/home-card.component';
import { ViewAttendanceComponent } from './attendance/student-attendance/view-attendance/view-attendance.component';
import { EditUsersComponent } from './users/edit-users/edit-users.component';
import {DeleteDataComponent} from "./delete-data/delete-data.component";
import {PrivacyPolicyComponent} from "./privacy-policy/privacy-policy.component";
import { AssignmentTableComponent } from './assignements/assignment-table/assignment-table.component';
import { AddAssignmentComponent } from './assignements/add-assignment/add-assignment.component';
import { StudentDetailComponent } from './student-detail/student-detail.component';

@NgModule({
    declarations: [
        AppComponent,
        NavComponent,
        DashboardComponent,
        ClassListComponent,
        AddClassComponent,
        StudentsListComponent,
        AddStudentComponent,
        AddAttendanceComponent,
        AttendanceListComponent,
        LoginComponent,
        UsersListComponent,
        StudentListComponent,
        ParentListComponent,
        TestListComponent,
        AddTestComponent,
        EditTestComponent,
        MessagesComponent,
        StudentAttendanceComponent,
        AddMessageComponent,
        SendUserMessageComponent,
        SendImageMessageComponent,
        GalleryComponent,
        AddGalleryComponent,
        BulkDataUploadComponent,
        SliderListComponent,
        AddSliderComponent,
        HomeComponent,
        HomeCardComponent,
        ViewAttendanceComponent,
        EditUsersComponent,
        DeleteDataComponent,
        PrivacyPolicyComponent,
        AssignmentTableComponent,
        AddAssignmentComponent,
        StudentDetailComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        NgbModule,
        AppRoutingModule,
        provideFirebaseApp(() => initializeApp(environment.firebase)),
        provideAnalytics(() => getAnalytics()),
        provideAuth(() => {
            const auth = getAuth();

            if (environment.useEmulator)
                connectAuthEmulator(auth, `http://localhost:9099`)

            return (auth);
        }),
        provideDatabase(() => {
            const db = getDatabase()

            if ( environment.useEmulator )
                connectDatabaseEmulator( db, 'localhost' , 9000 );

            return ( db );
        }),
        provideFirestore(() => {
            const firestore = getFirestore()

            if ( environment.useEmulator )
                connectFirestoreEmulator( firestore, 'localhost' , 8080 );
            return ( firestore );

        }),
        LayoutModule,
        MatToolbarModule,
        MatButtonModule,
        MatSidenavModule,
        MatIconModule,
        MatListModule,
        MatGridListModule,
        MatCardModule,
        MatMenuModule,
        RouterOutlet,
        RouterLink,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatSelectModule,
        MatInputModule,
        FormsModule,
        MatSnackBarModule,
        MatTableModule,
        MatDatepickerModule,
        MatRadioModule,
        MatDialogModule,
        PrettyJsonModule,
        MatTabsModule,
        MatAutocompleteModule,
        MatSortModule,
        MatPaginatorModule,
        MatProgressBarModule,
        MaterialFileInputModule,
        NgOptimizedImage,
        MatSlideToggleModule,
        MatRippleModule,
    ],
    providers: [
        ScreenTrackingService, UserTrackingService, {provide: FIREBASE_OPTIONS, useValue: environment.firebase},
        DatePipe,
        {
            provide: ENVIRONMENT_INITIALIZER,
            useFactory: initializeDialogService,
            deps: [MatDialog],
            multi: true
        },
        DatePipe,
        AuthGuard,
        {provide: MAT_DATE_LOCALE, useValue: 'en-US'}, // Set the desired locale
        {provide: DateAdapter, useClass: CustomDateAdapter},
        {provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS},
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
