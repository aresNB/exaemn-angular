import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { WalletApiService } from '../../core/services/wallet-api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-wallet-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="container">
      <h2>Créer un portefeuille</h2>

      <form [formGroup]="form" (ngSubmit)="onSubmit()">
        <div>
          <label>Téléphone</label>
          <input formControlName="phoneNumber" placeholder="+221770000000" />
          <span *ngIf="form.get('phoneNumber')?.invalid && form.get('phoneNumber')?.touched">
            Numéro invalide
          </span>
        </div>

        <div>
          <label>Email</label>
          <input formControlName="email" type="email" placeholder="client@gmail.com" />
          <span *ngIf="form.get('email')?.invalid && form.get('email')?.touched">
            Email invalide
          </span>
        </div>

        <div>
          <label>Code wallet</label>
          <input formControlName="code" placeholder="WLT-XXXXXX" />
        </div>

        <div>
          <label>Solde initial (XOF)</label>
          <input formControlName="initialBalance" type="number" placeholder="0" />
        </div>

        <div>
          <label>Devise</label>
          <input formControlName="currency" />
        </div>

        <button type="submit" [disabled]="form.invalid || loading">
          {{ loading ? 'Création...' : 'Créer' }}
        </button>

        <p *ngIf="successMessage" style="color: green">{{ successMessage }}</p>
        <p *ngIf="errorMessage" style="color: red">{{ errorMessage }}</p>
      </form>
    </div>
  `
})
export class WalletCreateComponent {
  loading = false;
  successMessage = '';
  errorMessage = '';

  form;

  constructor(private fb: FormBuilder, private walletApi: WalletApiService, private router: Router) {
    this.form = this.fb.group({
      phoneNumber: ['', [Validators.required, Validators.pattern(/^\+221\d{9}$/)]],
      email: ['', [Validators.required, Validators.email]],
      code: ['', Validators.required],
      initialBalance: [0, [Validators.required, Validators.min(0)]],
      currency: ['XOF', Validators.required]
    });
  }

  onSubmit() {
    if (this.form.invalid) return;
    this.loading = true;
    this.successMessage = '';
    this.errorMessage = '';

    this.walletApi.createWallet(this.form.value as any).subscribe({
      next: () => {
        this.loading = false;
        this.successMessage = 'Portefeuille créé avec succès !';
        this.form.reset({ currency: 'XOF', initialBalance: 0 });
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.message;
      }
    });
  }
}