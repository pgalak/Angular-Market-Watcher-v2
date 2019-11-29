import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SymbolsComponent } from './components/symbols/symbols.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AboutComponent } from './components/about/about.component';


const routes: Routes = [
  { path: '', redirectTo: '/symbols', pathMatch: 'full'},
  { path: 'symbols', component: SymbolsComponent},
  { path: 'dashboard', component: DashboardComponent},
  { path: 'about', component: AboutComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
