import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideFirebaseApp(() =>
      initializeApp({
        apiKey: 'AIzaSyAPj_RWpCtIUnle2i5H8oNpeY4bZi-ZWgE',
        authDomain: 'danotes-3f8ef.firebaseapp.com',
        projectId: 'danotes-3f8ef',
        storageBucket: 'danotes-3f8ef.firebasestorage.app',
        messagingSenderId: '457026107942',
        appId: '1:457026107942:web:8ab3ca9f6028f44fb484e7',
        // measurementId: 'G-XXXXXXX' // nur wenn Analytics benutzt wird
      })
    ),
    provideFirestore(() => getFirestore()),
  ],
};
