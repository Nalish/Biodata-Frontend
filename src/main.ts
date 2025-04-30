import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

// Bootstrap the application with routes
bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    ...appConfig.providers  // if you have other providers inside app.config.ts
  ]
});
