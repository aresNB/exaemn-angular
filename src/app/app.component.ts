// import { Component } from '@angular/core';
// import { RouterOutlet } from '@angular/router';
// import { NavbarComponent } from './shared/components/navbar.component';

// @Component({
//   selector: 'app-root',
//   standalone: true,
//   imports: [RouterOutlet, NavbarComponent],
//   template: `
//     <app-navbar />
//     <router-outlet />
//   `
// })
// export class AppComponent {}

import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/components/navbar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent],
  template: `
    <div class="app-shell">
      <app-navbar />
      <main class="content">
        <router-outlet />
      </main>
    </div>
  `,
  styles: [`
    .app-shell {
      display: flex;
      min-height: 100vh;
    }

    .content {
      flex: 1;
      padding: 32px;
      overflow-y: auto;
    }
  `]
})
export class AppComponent {}