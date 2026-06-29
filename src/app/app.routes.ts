import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'admin/wallets',
    loadComponent: () =>
      import('./features/agent/wallet-list.component').then(m => m.WalletListComponent)
  },
  {
    path: '',
    redirectTo: 'admin/wallets',
    pathMatch: 'full'
  }
];