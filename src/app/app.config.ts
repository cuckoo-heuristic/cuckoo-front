import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import { MyPreset } from './core/theme/gp.preset';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import {
  HttpClient,
  provideHttpClient,
  withInterceptors,
} from '@angular/common/http';
``;
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideHttpClient(withInterceptors([])),
    providePrimeNG({
      theme: {
        preset: MyPreset,
        options: {
          darkModeSelector: false,
        },
      },
    }),
    MessageService,
    DialogService,
    ConfirmationService,
  ],
};
