import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WalletApiService } from '../../core/services/wallet-api.service';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-seeder',
  standalone: true,
    imports: [CommonModule, FormsModule],
  template: `
    <div class="container">
      <h2>Seeder la base de données</h2>

      <p>Génère des portefeuilles et transactions de test.</p>

      <div style="display: flex; gap: 16px; margin-bottom: 24px;">
        <div>
          <label>Nombre de wallets</label>
          <input type="number" [(ngModel)]="numWallets" min="1" max="100" />
        </div>
        <div>
          <label>Transactions par wallet</label>
          <input type="number" [(ngModel)]="eventsPerWallet" min="1" max="500" />
        </div>
      </div>

      <button (click)="onSeed()" [disabled]="loading">
        {{ loading ? 'Génération en cours...' : 'Lancer le seeder' }}
      </button>

      <p *ngIf="successMessage" style="color: green">{{ successMessage }}</p>
      <p *ngIf="errorMessage" style="color: red">{{ errorMessage }}</p>
    </div>
  `
})
export class SeederComponent {
  numWallets = 10;
  eventsPerWallet = 100;
  loading = false;
  successMessage = '';
  errorMessage = '';

  constructor(private walletApi: WalletApiService) {}

  onSeed() {
    this.loading = true;
    this.successMessage = '';
    this.errorMessage = '';

    this.walletApi.seed(this.numWallets, this.eventsPerWallet).subscribe({
      next: (res) => {
        this.loading = false;
        this.successMessage = res;
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.message;
      }
    });
  }
}