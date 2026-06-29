import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Wallet {
  id: number;
  phoneNumber: string;
  email: string;
  balance: number;
  code: string;
  currency: string;
}

export interface TransferDto {
  senderPhone: string;
  receiverPhone: string;
  amount: number;
}

export interface DepositDto {
  amount: number;
  paymentMethod: string;
}

export interface WithdrawDto {
  phoneNumber: string;
  amount: number;
}

export interface PayFacturesDto {
  phoneNumber: string;
  serviceName: string;
  factureReferences: string[];
}

export interface Transaction {
  id: number;
  type: string;
  montant: number;
  frais: number;
  date: string;
  description: string;
}

@Injectable({ providedIn: 'root' })
export class WalletApiService {
  private readonly BASE = `${environment.apiUrl}/api/wallets`;

  constructor(private http: HttpClient) {}

  // Agent
  getWallets(page = 0, size = 10): Observable<any> {
    return this.http.get<any>(`${this.BASE}?page=${page}&size=${size}`);
  }

  createWallet(data: Partial<Wallet>): Observable<Wallet> {
    return this.http.post<Wallet>(this.BASE, data);
  }

  getWalletByPhone(phone: string): Observable<Wallet> {
    return this.http.get<Wallet>(`${this.BASE}/${phone}`);
  }

  deposit(id: number, data: DepositDto): Observable<any> {
    return this.http.post<any>(`${this.BASE}/${id}/deposit`, data);
  }

  withdraw(data: WithdrawDto): Observable<any> {
    return this.http.post<any>(`${this.BASE}/withdraw`, data);
  }

  // Client
  getBalance(phone: string): Observable<number> {
    return this.http.get<number>(`${this.BASE}/${phone}/balance`);
  }

  transfer(data: TransferDto): Observable<any> {
    return this.http.post<any>(`${this.BASE}/transfer`, data);
  }

  payFactures(data: PayFacturesDto): Observable<any> {
    return this.http.post<any>(`${this.BASE}/pay-factures`, data);
  }

  getTransactions(phone: string): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(`${this.BASE}/${phone}/transactions`);
  }
}