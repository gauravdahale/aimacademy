import {ENVIRONMENT_INITIALIZER, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {initializeApp, provideFirebaseApp} from '@angular/fire/app';
import {environment} from '../environments/environment';
import {provideAnalytics, getAnalytics, ScreenTrackingService, UserTrackingService} from '@angular/fire/analytics';
import {provideAuth, getAuth} from '@angular/fire/auth';
import {provideDatabase, getDatabase} from '@angular/fire/database';
import {provideFirestore, getFirestore} from '@angular/fire/firestore';
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
import {ConfirmDialogComponent} from "./confirm-dialog/confirm-dialog.component";
import {StudentsListComponent} from './students-list/students-list.component';
import {AddStudentComponent} from './add-student/add-student.component';
import {AddAttendanceComponent} from './add-attendance/add-attendance.component';
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatRadioModule} from "@angular/material/radio";
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from "@angular/material/core";
import {CustomDateAdapter, MY_DATE_FORMATS} from "./CustomDateAdapter";
import {PrettyJsonModule} from "angular2-prettyjson";
import {DatePipe} from "@angular/common";
import {AttendanceListComponent} from './attendance-list/attendance-list.component';
import {LoginComponent} from './login/login.component';
import {AuthGuard} from "./services/auth.guard";

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
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        NgbModule,
        AppRoutingModule,
        provideFirebaseApp(() => initializeApp(environment.firebase)),
        provideAnalytics(() => getAnalytics()),
        provideAuth(() => getAuth()),
        provideDatabase(() => getDatabase()),
        provideFirestore(() => getFirestore()),
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
        MatIconModule,
        MatDatepickerModule,
        MatRadioModule,
        MatDialogModule,
        PrettyJsonModule,
    ],
    providers: [
        ScreenTrackingService, UserTrackingService, {provide: FIREBASE_OPTIONS, useValue: environment.firebase},
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
