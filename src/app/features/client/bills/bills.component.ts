import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { BillingApiService, Facture } from '../../../core/services/billing-api.service';
import { WalletApiService } from '../../../core/services/wallet-api.service';
import { BalanceStore } from '../../../core/services/balance.store';
import { XofPipe } from '../../../shared/pipes/xof.pipe';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-bills',
  standalone: true,
    imports: [CommonModule, ReactiveFormsModule, FormsModule, XofPipe],
  template: `
    <div class="container">
      <h2>Factures</h2>

      <div class="tabs">
        <button (click)="activeTab = 'current'" [class.active]="activeTab === 'current'">
          Mois en cours
        </button>
        <button (click)="activeTab = 'periode'" [class.active]="activeTab === 'periode'">
          Par période
        </button>
      </div>

      <!-- MOIS EN COURS -->
      <div *ngIf="activeTab === 'current'">
        <div>
          <label>Filtrer par service</label>
          <select [(ngModel)]="selectedService" (change)="loadCurrentFactures()" [ngModelOptions]="{standalone: true}">
            <option value="">Tous</option>
            <option value="ISM">ISM</option>
            <option value="WOYAFAL">WOYAFAL</option>
          </select>
          <button (click)="loadCurrentFactures()">Charger</button>
        </div>

        <table *ngIf="factures.length > 0">
          <thead>
            <tr>
              <th><input type="checkbox" (change)="toggleAll($event)" /></th>
              <th>Référence</th>
              <th>Service</th>
              <th>Montant</th>
              <th>Statut</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let f of factures">
              <td><input type="checkbox" [value]="f.reference" (change)="toggleSelection(f.reference, $event)" /></td>
              <td>{{ f.reference }}</td>
              <td>{{ f.serviceName }}</td>
              <td>{{ f.montant | xof }}</td>
              <td>{{ f.payee ? 'Payée' : 'Impayée' }}</td>
            </tr>
          </tbody>
        </table>

        <p *ngIf="factures.length === 0 && loaded">Aucune facture impayée.</p>

        <button *ngIf="selectedRefs.length > 0" (click)="payerSelection()">
          Payer {{ selectedRefs.length }} facture(s) sélectionnée(s)
        </button>
      </div>

      <!-- PAR PERIODE -->
      <div *ngIf="activeTab === 'periode'">
        <form [formGroup]="periodeForm" (ngSubmit)="loadPeriodeFactures()">
          <div>
            <label>Date début</label>
            <input formControlName="debut" type="date" />
          </div>
          <div>
            <label>Date fin</label>
            <input formControlName="fin" type="date" />
          </div>
          <button type="submit" [disabled]="periodeForm.invalid">Rechercher</button>
        </form>

        <table *ngIf="facturesPeriode.length > 0">
          <thead>
            <tr>
              <th>Référence</th>
              <th>Service</th>
              <th>Montant</th>
              <th>Date</th>
              <th>Statut</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let f of facturesPeriode">
              <td>{{ f.reference }}</td>
              <td>{{ f.serviceName }}</td>
              <td>{{ f.montant | xof }}</td>
              <td>{{ f.dateFacture }}</td>
              <td>{{ f.payee ? 'Payée' : 'Impayée' }}</td>
            </tr>
          </tbody>
        </table>

        <p *ngIf="facturesPeriode.length === 0 && loadedPeriode">Aucune facture sur cette période.</p>
      </div>

      <p *ngIf="successMessage" style="color: green">{{ successMessage }}</p>
      <p *ngIf="errorMessage" style="color: red">{{ errorMessage }}</p>
    </div>
  `
})
export class BillsComponent {
  activeTab: 'current' | 'periode' = 'current';
  factures: any[] = [];
  facturesPeriode: any[] = [];
  selectedRefs: string[] = [];
  selectedService = '';
  loaded = false;
  loadedPeriode = false;
  successMessage = '';
  errorMessage = '';
  periodeForm;

  constructor(
    private fb: FormBuilder,
    private billingApi: BillingApiService,
    private walletApi: WalletApiService,
    public balanceStore: BalanceStore
  ) {
    const saved = localStorage.getItem('bw_phone');
    if (saved && !this.balanceStore.currentPhone()) this.balanceStore.setPhone(saved);

    this.periodeForm = this.fb.group({
      debut: ['', Validators.required],
      fin: ['', Validators.required]
    });
  }

  get walletCode(): string {
    return 'WLT-' + this.balanceStore.currentPhone().replace('+221770000', '000000').padStart(7, '0');
  }

  loadCurrentFactures() {
    this.loaded = false;
    this.billingApi.getCurrentFactures(this.walletCode, this.selectedService).subscribe({
      next: (res) => { this.factures = res; this.loaded = true; },
      error: () => { this.errorMessage = 'Erreur lors du chargement'; this.loaded = true; }
    });
  }

  loadPeriodeFactures() {
    this.loadedPeriode = false;
    const { debut, fin } = this.periodeForm.value;
    this.billingApi.getFacturesByPeriode(this.walletCode, debut!, fin!).subscribe({
      next: (res) => { this.facturesPeriode = res; this.loadedPeriode = true; },
      error: () => { this.errorMessage = 'Erreur lors du chargement'; this.loadedPeriode = true; }
    });
  }

  toggleSelection(ref: string, event: any) {
    if (event.target.checked) {
      this.selectedRefs.push(ref);
    } else {
      this.selectedRefs = this.selectedRefs.filter(r => r !== ref);
    }
  }

  toggleAll(event: any) {
    if (event.target.checked) {
      this.selectedRefs = this.factures.map(f => f.reference);
    } else {
      this.selectedRefs = [];
    }
  }

  payerSelection() {
    this.successMessage = '';
    this.errorMessage = '';
    this.walletApi.payFactures({
      phoneNumber: this.balanceStore.currentPhone(),
      serviceName: this.selectedService || 'ISM',
      factureReferences: this.selectedRefs
    }).subscribe({
      next: () => {
        this.successMessage = 'Factures payées avec succès !';
        this.selectedRefs = [];
        this.loadCurrentFactures();
        this.balanceStore.refresh();
      },
      error: (err) => { this.errorMessage = err.message; }
    });
  }
}