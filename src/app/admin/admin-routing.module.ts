import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PredictionListComponent } from './prediction-list/prediction-list.component';
import { PredictionComponent } from './prediction/prediction.component';

const routes: Routes = [
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
  },
  {
    path: 'prediction',
    component: PredictionComponent
  },
  {
    path: 'prediction-list',
    component: PredictionListComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
