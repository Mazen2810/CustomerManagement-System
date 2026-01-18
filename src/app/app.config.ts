import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';

import {provideFirebaseApp,initializeApp} from '@angular/fire/app';
import {provideFirestore, getFirestore} from '@angular/fire/firestore'


import { environment } from '../environments/environment';
import { provideCloudinaryLoader } from '@angular/common';
import { provideHttpClient } from '@angular/common/http';
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes), 
    provideHttpClient(),
    // Firebase Initialization
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideFirestore(() => getFirestore()),

    // Cloudinary Configuration
provideCloudinaryLoader(`https://res.cloudinary.com/${environment.cloudinary.cloudName}`)

  ]
};
