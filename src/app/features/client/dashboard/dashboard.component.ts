import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { BalanceStore } from '../../../core/services/balance.store';
import { XofPipe } from '../../../shared/pipes/xof.pipe';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, XofPipe],
  template: `
    <div class="container">
      <h2>Tableau de bord</h2>

      <!-- Sélection du compte -->
      <div *ngIf="!balanceStore.currentPhone()">
        <form [formGroup]="phoneForm" (ngSubmit)="onSetPhone()">
          <label>Votre numéro de téléphone</label>
          <input formControlName="phone" placeholder="+221770000001" />
          <span *ngIf="phoneForm.get('phone')?.invalid && phoneForm.get('phone')?.touched">
            Numéro invalide
          </span>
          <button type="submit" [disabled]="phoneForm.invalid">Accéder</button>
        </form>
      </div>

      <!-- Dashboard -->
      <div *ngIf="balanceStore.currentPhone()">
        <div class="balance-card">
          <p>Numéro : {{ balanceStore.currentPhone() }}</p>
          <h3>Solde actuel</h3>
          <p class="balance">{{ balanceStore.balance() | xof }}</p>
          <button (click)="balanceStore.refresh()">Actualiser</button>
          <button (click)="disconnect()">Changer de compte</button>
        </div>
      </div>
    </div>
  `
})
export class DashboardComponent implements OnInit {
  phoneForm;

  constructor(
    private fb: FormBuilder,
    public balanceStore: BalanceStore
  ) {
    this.phoneForm = this.fb.group({
      phone: ['', [Validators.required, Validators.pattern(/^\+221\d{9}$/)]]
    });
  }

  ngOnInit() {
    const saved = localStorage.getItem('bw_phone');
    if (saved) this.balanceStore.setPhone(saved);
  }

  onSetPhone() {
    if (this.phoneForm.invalid) return;
    const phone = this.phoneForm.value.phone!;
    localStorage.setItem('bw_phone', phone);
    this.balanceStore.setPhone(phone);
  }

  disconnect() {
    localStorage.removeItem('bw_phone');
    this.balanceStore.setPhone('');
  }
}