// import { Component } from '@angular/core';
// import { RouterLink, RouterLinkActive } from '@angular/router';

// @Component({
//   selector: 'app-navbar',
//   standalone: true,
//   imports: [RouterLink, RouterLinkActive],
//   template: `
//     <nav>
//       <div class="brand">💰 BadWallet</div>

//       <div class="links">
//         <span class="section">Agent</span>
//         <a routerLink="/admin/wallets" routerLinkActive="active">Liste wallets</a>
//         <a routerLink="/admin/wallets/create" routerLinkActive="active">Créer wallet</a>
//         <a routerLink="/admin/wallets/search" routerLinkActive="active">Rechercher</a>
//         <a routerLink="/admin/deposit-withdraw" routerLinkActive="active">Dépôt / Retrait</a>
//         <a routerLink="/admin/seeder" routerLinkActive="active">Seeder</a>

//         <span class="section">Client</span>
//         <a routerLink="/dashboard" routerLinkActive="active">Dashboard</a>
//         <a routerLink="/transfer" routerLinkActive="active">Transfert</a>
//         <a routerLink="/bills" routerLinkActive="active">Factures</a>
//         <a routerLink="/transactions" routerLinkActive="active">Historique</a>
//       </div>
//     </nav>
//   `,
//   styles: [`
//     nav {
//       display: flex;
//       align-items: center;
//       gap: 24px;
//       background: #1e293b;
//       padding: 12px 24px;
//       flex-wrap: wrap;
//     }
//     .brand {
//       color: #f59e0b;
//       font-weight: bold;
//       font-size: 1.2rem;
//     }
//     .links {
//       display: flex;
//       align-items: center;
//       gap: 12px;
//       flex-wrap: wrap;
//     }
//     .section {
//       color: #94a3b8;
//       font-size: 0.75rem;
//       text-transform: uppercase;
//       margin-left: 12px;
//     }
//     a {
//       color: #cbd5e1;
//       text-decoration: none;
//       padding: 4px 10px;
//       border-radius: 4px;
//       font-size: 0.9rem;
//     }
//     a.active {
//       background: #f59e0b;
//       color: #1e293b;
//       font-weight: bold;
//     }
//     a:hover {
//       background: #334155;
//     }
//   `]
// })
// export class NavbarComponent {}

import { Component, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <nav class="sidebar">
      <div class="brand">
        <i class="fa-solid fa-sack-dollar"></i> BadWallet
      </div>

      <div class="mode-switch">
        <button
          [class.active]="mode() === 'client'"
          (click)="setMode('client')">
          Client
        </button>
        <button
          [class.active]="mode() === 'agent'"
          (click)="setMode('agent')">
          Agent
        </button>
      </div>

      @if (mode() === 'agent') {
        <div class="links">
          <a routerLink="/admin/wallets" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">
            <i class="fa-solid fa-list"></i> Liste portefeuilles
          </a>
          <a routerLink="/admin/wallets/create" routerLinkActive="active">
            <i class="fa-solid fa-plus"></i> Créer un portefeuille
          </a>
          <a routerLink="/admin/wallets/search" routerLinkActive="active">
            <i class="fa-solid fa-magnifying-glass"></i> Rechercher
          </a>
          <a routerLink="/admin/deposit-withdraw" routerLinkActive="active">
            <i class="fa-solid fa-right-left"></i> Dépôt / Retrait
          </a>
          <a routerLink="/admin/seeder" routerLinkActive="active">
            <i class="fa-solid fa-seedling"></i> Seeder
          </a>
        </div>
      } @else {
        <div class="links">
          <a routerLink="/dashboard" routerLinkActive="active">
            <i class="fa-solid fa-house"></i> Dashboard
          </a>
          <a routerLink="/transfer" routerLinkActive="active">
            <i class="fa-solid fa-arrow-right-arrow-left"></i> Transfert
          </a>
          <a routerLink="/bills" routerLinkActive="active">
            <i class="fa-solid fa-file-invoice"></i> Factures
          </a>
          <a routerLink="/transactions" routerLinkActive="active">
            <i class="fa-solid fa-clock-rotate-left"></i> Historique
          </a>
        </div>
      }
    </nav>
  `,
  styles: [`
    .sidebar {
      display: flex;
      flex-direction: column;
      width: 240px;
      height: 100vh;
      background: #1e293b;
      padding: 24px 16px;
      gap: 24px;
      position: sticky;
      top: 0;
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #f59e0b;
      font-weight: bold;
      font-size: 1.25rem;
    }

    .mode-switch {
      display: flex;
      background: #0f172a;
      border-radius: 8px;
      padding: 4px;
      gap: 4px;
    }

    .mode-switch button {
      flex: 1;
      background: transparent;
      color: #94a3b8;
      border: none;
      padding: 6px 0;
      border-radius: 6px;
      font-size: 0.8rem;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.2s, color 0.2s;
    }

    .mode-switch button.active {
      background: #f59e0b;
      color: #1e293b;
    }

    .links {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    a {
      color: #cbd5e1;
      text-decoration: none;
      padding: 10px 12px;
      border-radius: 8px;
      font-size: 0.9rem;
      display: flex;
      align-items: center;
      gap: 10px;
      transition: background 0.15s;
    }

    a i {
      width: 16px;
      text-align: center;
      font-size: 0.9rem;
    }

    a:hover {
      background: #334155;
    }

    a.active {
      background: #f59e0b;
      color: #1e293b;
      font-weight: bold;
    }
  `]
})
export class NavbarComponent {
  mode = signal<'client' | 'agent'>('client');

  constructor(private router: Router) {
    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe(() => {
        this.mode.set(this.router.url.startsWith('/admin') ? 'agent' : 'client');
      });

    this.mode.set(this.router.url.startsWith('/admin') ? 'agent' : 'client');
  }

  setMode(m: 'client' | 'agent') {
    this.mode.set(m);
    this.router.navigate([m === 'agent' ? '/admin/wallets' : '/dashboard']);
  }
}