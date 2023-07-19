import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {NavComponent} from "./nav/nav.component";
import {AuthGuard} from "@angular/fire/auth-guard";
import {ClassListComponent} from "./class-list/class-list.component";
import {DashboardComponent} from "./dashboard/dashboard.component";

const routes: Routes = [

  {
    path: '',

    component: NavComponent,
    // component: NavigationComponent,
    // canActivate: [AuthGuard],
    children: [

      {
        path: '',
        pathMatch: 'full',
        component: DashboardComponent,
        // canActivate: [AuthGuard],

      },
      {
        path: 'class-list',
        component: ClassListComponent,
        // canActivate: [AuthGuard],

      },

    ],
  },
  // { path: 'login', component: LoginComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
