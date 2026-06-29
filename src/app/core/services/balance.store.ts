import { Injectable, signal } from '@angular/core';
import { WalletApiService } from './wallet-api.service';

@Injectable({ providedIn: 'root' })
export class BalanceStore {
  readonly balance = signal<number>(0);
  readonly currentPhone = signal<string>('');

  constructor(private api: WalletApiService) {}

  setPhone(phone: string) {
    this.currentPhone.set(phone);
    this.refresh();
  }

  refresh() {
    const phone = this.currentPhone();
    if (!phone) return;
    this.api.getBalance(phone).subscribe(b => this.balance.set(b));
  }
}