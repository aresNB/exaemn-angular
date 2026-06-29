import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { WalletApiService, Wallet } from '../../core/services/wallet-api.service';
import { XofPipe } from '../../shared/pipes/xof.pipe';
import { PhonePipe } from '../../shared/pipes/phone.pipe';

@Component({
  selector: 'app-wallet-search',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, XofPipe, PhonePipe],
  template: `
    <div class="container">
      <h2>Rechercher un client</h2>

      <form [formGroup]="form" (ngSubmit)="onSearch()">
        <div>
          <label>Numéro de téléphone</label>
          <input formControlName="phone" placeholder="+221770000001" />
          <span *ngIf="form.get('phone')?.invalid && form.get('phone')?.touched">
            Numéro invalide
          </span>
        </div>
        <button type="submit" [disabled]="form.invalid || loading">
          {{ loading ? 'Recherche...' : 'Rechercher' }}
        </button>
      </form>

      <div *ngIf="wallet" class="wallet-details">
        <h3>Détails du portefeuille</h3>
        <p><strong>Téléphone :</strong> {{ wallet.phoneNumber | phone }}</p>
        <p><strong>Email :</strong> {{ wallet.email }}</p>
        <p><strong>Code :</strong> {{ wallet.code }}</p>
        <p><strong>Solde :</strong> {{ wallet.balance | xof }}</p>
      </div>

      <p *ngIf="errorMessage" style="color: red">{{ errorMessage }}</p>
    </div>
  `
})
export class WalletSearchComponent {
  wallet: Wallet | null = null;
  loading = false;
  errorMessage = '';
  form;

  constructor(private fb: FormBuilder, private walletApi: WalletApiService) {
    this.form = this.fb.group({
      phone: ['', [Validators.required, Validators.pattern(/^\+221\d{9}$/)]]
    });
  }

  onSearch() {
    if (this.form.invalid) return;
    this.loading = true;
    this.errorMessage = '';
    this.wallet = null;

    const phone = this.form.value.phone!;
    this.walletApi.getWalletByPhone(phone).subscribe({
      next: (res) => {
        this.loading = false;
        this.wallet = res;
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = 'Client introuvable';
      }
    });
  }
}