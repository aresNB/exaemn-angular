import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { WalletApiService } from '../../../core/services/wallet-api.service';
import { BalanceStore } from '../../../core/services/balance.store';

function differentPhoneValidator(senderPhone: string) {
  return (control: AbstractControl): ValidationErrors | null => {
    return control.value === senderPhone ? { samePhone: true } : null;
  };
}

@Component({
  selector: 'app-transfer',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="container">
      <h2>Transfert d'argent</h2>

      <div *ngIf="!balanceStore.currentPhone()">
        <p>Veuillez d'abord accéder à votre compte depuis le <a href="/dashboard">tableau de bord</a>.</p>
      </div>

      <div *ngIf="balanceStore.currentPhone()">
        <p>Expéditeur : <strong>{{ balanceStore.currentPhone() }}</strong></p>

        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <div>
            <label>Numéro destinataire</label>
            <input formControlName="receiverPhone" placeholder="+221770000002" />
            <span *ngIf="form.get('receiverPhone')?.errors?.['required'] && form.get('receiverPhone')?.touched">
              Numéro requis
            </span>
            <span *ngIf="form.get('receiverPhone')?.errors?.['pattern'] && form.get('receiverPhone')?.touched">
              Format invalide
            </span>
            <span *ngIf="form.get('receiverPhone')?.errors?.['samePhone'] && form.get('receiverPhone')?.touched">
              Le destinataire doit être différent de l'expéditeur
            </span>
          </div>

          <div>
            <label>Montant (XOF)</label>
            <input formControlName="amount" type="number" placeholder="1000" />
            <span *ngIf="form.get('amount')?.invalid && form.get('amount')?.touched">
              Montant invalide
            </span>
          </div>

          <button type="submit" [disabled]="form.invalid || loading">
            {{ loading ? 'Envoi...' : 'Transférer' }}
          </button>
        </form>

        <p *ngIf="successMessage" style="color: green">{{ successMessage }}</p>
        <p *ngIf="errorMessage" style="color: red">{{ errorMessage }}</p>
      </div>
    </div>
  `
})
export class TransferComponent {
  loading = false;
  successMessage = '';
  errorMessage = '';
  form;

  constructor(
    private fb: FormBuilder,
    private walletApi: WalletApiService,
    public balanceStore: BalanceStore
  ) {
    const saved = localStorage.getItem('bw_phone');
    if (saved && !this.balanceStore.currentPhone()) this.balanceStore.setPhone(saved);

    this.form = this.fb.group({
      receiverPhone: ['', [
        Validators.required,
        Validators.pattern(/^\+221\d{9}$/),
        differentPhoneValidator(this.balanceStore.currentPhone())
      ]],
      amount: [null, [Validators.required, Validators.min(1)]]
    });
  }

  onSubmit() {
    if (this.form.invalid) return;
    this.loading = true;
    this.successMessage = '';
    this.errorMessage = '';

    const { receiverPhone, amount } = this.form.value;
    this.walletApi.transfer({
      senderPhone: this.balanceStore.currentPhone(),
      receiverPhone: receiverPhone!,
      amount: amount!
    }).subscribe({
      next: () => {
        this.loading = false;
        this.successMessage = 'Transfert effectué avec succès !';
        this.form.reset();
        this.balanceStore.refresh();
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.message;
      }
    });
  }
}