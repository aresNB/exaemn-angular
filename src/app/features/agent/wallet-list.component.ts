import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WalletApiService, Wallet } from '../../core/services/wallet-api.service';
import { XofPipe } from '../../shared/pipes/xof.pipe';
import { PhonePipe } from '../../shared/pipes/phone.pipe';

@Component({
  selector: 'app-wallet-list',
  standalone: true,
  imports: [CommonModule, XofPipe, PhonePipe],
  template: `
    <div class="container">
      <h2>Liste des portefeuilles</h2>

      <table>
        <thead>
          <tr>
            <th>Téléphone</th>
            <th>Email</th>
            <th>Code</th>
            <th>Solde</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let wallet of wallets">
            <td>{{ wallet.phoneNumber | phone }}</td>
            <td>{{ wallet.email }}</td>
            <td>{{ wallet.code }}</td>
            <td>{{ wallet.balance | xof }}</td>
          </tr>
        </tbody>
      </table>

      <div class="pagination">
        <button (click)="changePage(currentPage - 1)" [disabled]="currentPage === 0">
          Précédent
        </button>
        <span>Page {{ currentPage + 1 }}</span>
        <button (click)="changePage(currentPage + 1)" [disabled]="!hasNext">
          Suivant
        </button>
      </div>
    </div>
  `
})
export class WalletListComponent implements OnInit {
  wallets: Wallet[] = [];
  currentPage = 0;
  hasNext = false;

  constructor(private walletApi: WalletApiService) {}

  ngOnInit() {
    this.loadWallets();
  }

  loadWallets() {
    this.walletApi.getWallets(this.currentPage, 10).subscribe({
      next: (res) => {
        this.wallets = res.content ?? res;
        this.hasNext = res.last === false;
      },
      error: (err) => console.error(err)
    });
  }

  changePage(page: number) {
    this.currentPage = page;
    this.loadWallets();
  }
}