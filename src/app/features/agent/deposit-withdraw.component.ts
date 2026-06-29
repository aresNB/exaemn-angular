import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { WalletApiService } from '../../core/services/wallet-api.service';

@Component({
  selector: 'app-deposit-withdraw',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="container">
      <h2>Dépôt / Retrait</h2>

      <div class="tabs">
        <button (click)="activeTab = 'deposit'" [class.active]="activeTab === 'deposit'">
          Dépôt
        </button>
        <button (click)="activeTab = 'withdraw'" [class.active]="activeTab === 'withdraw'">
          Retrait
        </button>
      </div>

      <!-- DEPOT -->
      <form *ngIf="activeTab === 'deposit'" [formGroup]="depositForm" (ngSubmit)="onDeposit()">
        <h3>Créditer un compte</h3>
        <div>
          <label>ID du wallet</label>
          <input formControlName="walletId" type="number" placeholder="1" />
        </div>
        <div>
          <label>Montant (XOF)</label>
          <input formControlName="amount" type="number" placeholder="10000" />
        </div>
        <div>
          <label>Méthode de paiement</label>
          <select formControlName="paymentMethod">
            <option value="CREDIT_CARD">Carte de crédit</option>
            <option value="BANK_TRANSFER">Virement bancaire</option>
            <option value="CASH">Espèces</option>
          </select>
        </div>
        <button type="submit" [disabled]="depositForm.invalid || loading">
          {{ loading ? 'Traitement...' : 'Déposer' }}
        </button>
      </form>

      <!-- RETRAIT -->
      <form *ngIf="activeTab === 'withdraw'" [formGroup]="withdrawForm" (ngSubmit)="onWithdraw()">
        <h3>Débiter un compte</h3>
        <div>
          <label>Téléphone</label>
          <input formControlName="phoneNumber" placeholder="+221770000001" />
        </div>
        <div>
          <label>Montant (XOF)</label>
          <input formControlName="amount" type="number" placeholder="10000" />
        </div>
        <button type="submit" [disabled]="withdrawForm.invalid || loading">
          {{ loading ? 'Traitement...' : 'Retirer' }}
        </button>
      </form>

      <p *ngIf="successMessage" style="color: green">{{ successMessage }}</p>
      <p *ngIf="errorMessage" style="color: red">{{ errorMessage }}</p>
    </div>
  `
})
export class DepositWithdrawComponent {
  activeTab: 'deposit' | 'withdraw' = 'deposit';
  loading = false;
  successMessage = '';
  errorMessage = '';
  depositForm;
  withdrawForm;

  constructor(private fb: FormBuilder, private walletApi: WalletApiService) {
    this.depositForm = this.fb.group({
      walletId: [null, [Validators.required, Validators.min(1)]],
      amount: [null, [Validators.required, Validators.min(1)]],
      paymentMethod: ['CREDIT_CARD', Validators.required]
    });

    this.withdrawForm = this.fb.group({
      phoneNumber: ['', [Validators.required, Validators.pattern(/^\+221\d{9}$/)]],
      amount: [null, [Validators.required, Validators.min(1)]]
    });
  }

  onDeposit() {
    if (this.depositForm.invalid) return;
    this.loading = true;
    this.successMessage = '';
    this.errorMessage = '';

    const { walletId, amount, paymentMethod } = this.depositForm.value;
    this.walletApi.deposit(walletId!, { amount: amount!, paymentMethod: paymentMethod! }).subscribe({
      next: () => {
        this.loading = false;
        this.successMessage = 'Dépôt effectué avec succès !';
        this.depositForm.reset({ paymentMethod: 'CREDIT_CARD' });
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.message;
      }
    });
  }

  onWithdraw() {
    if (this.withdrawForm.invalid) return;
    this.loading = true;
    this.successMessage = '';
    this.errorMessage = '';

    const { phoneNumber, amount } = this.withdrawForm.value;
    this.walletApi.withdraw({ phoneNumber: phoneNumber!, amount: amount! }).subscribe({
      next: () => {
        this.loading = false;
        this.successMessage = 'Retrait effectué avec succès !';
        this.withdrawForm.reset();
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.message;
      }
    });
  }
}