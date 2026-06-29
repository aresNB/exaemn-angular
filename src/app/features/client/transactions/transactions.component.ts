import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WalletApiService, Transaction } from '../../../core/services/wallet-api.service';
import { BalanceStore } from '../../../core/services/balance.store';
import { XofPipe } from '../../../shared/pipes/xof.pipe';

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [CommonModule, XofPipe],
  template: `
    <div class="container">
      <h2>Historique des transactions</h2>

      <p *ngIf="!balanceStore.currentPhone()">
        Veuillez d'abord accéder à votre compte depuis le
        <a href="/dashboard">tableau de bord</a>.
      </p>

      <div *ngIf="balanceStore.currentPhone()">
        <p>Compte : <strong>{{ balanceStore.currentPhone() }}</strong></p>

        <p *ngIf="transactions.length === 0">Aucune transaction trouvée.</p>

        <table *ngIf="transactions.length > 0">
          <thead>
            <tr>
              <th>Type</th>
              <th>Montant</th>
              <th>Frais</th>
              <th>Description</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let t of transactions">
              <td>{{ t.type }}</td>
              <td>{{ t.montant | xof }}</td>
              <td>{{ t.frais | xof }}</td>
              <td>{{ t.description }}</td>
              <td>{{ t.date | date:'dd/MM/yyyy HH:mm' }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p *ngIf="errorMessage" style="color: red">{{ errorMessage }}</p>
    </div>
  `
})
export class TransactionsComponent implements OnInit {
  transactions: Transaction[] = [];
  errorMessage = '';

  constructor(
    private walletApi: WalletApiService,
    public balanceStore: BalanceStore
  ) {
    const saved = localStorage.getItem('bw_phone');
    if (saved && !this.balanceStore.currentPhone()) this.balanceStore.setPhone(saved);
  }

  ngOnInit() {
    if (this.balanceStore.currentPhone()) {
      this.loadTransactions();
    }
  }

  loadTransactions() {
    this.walletApi.getTransactions(this.balanceStore.currentPhone()).subscribe({
      next: (res) => { this.transactions = res; },
      error: () => { this.errorMessage = 'Erreur lors du chargement'; }
    });
  }
}