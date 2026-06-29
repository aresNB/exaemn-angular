import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <nav>
      <div class="brand">💰 BadWallet</div>

      <div class="links">
        <span class="section">Agent</span>
        <a routerLink="/admin/wallets" routerLinkActive="active">Liste wallets</a>
        <a routerLink="/admin/wallets/create" routerLinkActive="active">Créer wallet</a>
        <a routerLink="/admin/wallets/search" routerLinkActive="active">Rechercher</a>
        <a routerLink="/admin/deposit-withdraw" routerLinkActive="active">Dépôt / Retrait</a>
        <a routerLink="/admin/seeder" routerLinkActive="active">Seeder</a>

        <span class="section">Client</span>
        <a routerLink="/dashboard" routerLinkActive="active">Dashboard</a>
        <a routerLink="/transfer" routerLinkActive="active">Transfert</a>
        <a routerLink="/bills" routerLinkActive="active">Factures</a>
        <a routerLink="/transactions" routerLinkActive="active">Historique</a>
      </div>
    </nav>
  `,
  styles: [`
    nav {
      display: flex;
      align-items: center;
      gap: 24px;
      background: #1e293b;
      padding: 12px 24px;
      flex-wrap: wrap;
    }
    .brand {
      color: #f59e0b;
      font-weight: bold;
      font-size: 1.2rem;
    }
    .links {
      display: flex;
      align-items: center;
      gap: 12px;
      flex-wrap: wrap;
    }
    .section {
      color: #94a3b8;
      font-size: 0.75rem;
      text-transform: uppercase;
      margin-left: 12px;
    }
    a {
      color: #cbd5e1;
      text-decoration: none;
      padding: 4px 10px;
      border-radius: 4px;
      font-size: 0.9rem;
    }
    a.active {
      background: #f59e0b;
      color: #1e293b;
      font-weight: bold;
    }
    a:hover {
      background: #334155;
    }
  `]
})
export class NavbarComponent {}