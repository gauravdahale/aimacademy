/// <reference types="@angular/localize" />
import {enableProdMode, ENVIRONMENT_INITIALIZER, importProvidersFrom, inject} from '@angular/core';

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import {DialogService} from "./app/services/dialog.service";


platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
export function initializeDialogService() {
    return () => {
        inject(DialogService)
    };
}
