import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SymbolsComponent } from './components/symbols/symbols.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { WatchlistComponent } from './components/watchlist/watchlist.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { TableComponent } from './components/dashboard/table/table.component';
import { GraphsComponent } from './components/dashboard/graphs/graphs.component';
import { ActiveDirective } from './components/shared/active.directive';

@NgModule({
  declarations: [
    AppComponent,
    SymbolsComponent,
    NavbarComponent,
    SidebarComponent,
    WatchlistComponent,
    DashboardComponent,
    TableComponent,
    GraphsComponent,
    ActiveDirective
  ],
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    NgbModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
