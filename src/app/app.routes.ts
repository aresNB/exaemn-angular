import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'admin/wallets',
    loadComponent: () =>
      import('./features/agent/wallet-list.component').then(m => m.WalletListComponent)
  },
  {
    path: 'admin/wallets/create',
    loadComponent: () =>
      import('./features/agent/wallet-create.component').then(m => m.WalletCreateComponent)
  },
    {
    path: 'admin/wallets/search',
    loadComponent: () =>
      import('./features/agent/wallet-search.component').then(m => m.WalletSearchComponent)
  },
  {
    path: '',
    redirectTo: 'admin/wallets',
    pathMatch: 'full'
  }
];
