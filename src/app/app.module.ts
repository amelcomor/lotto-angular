import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { SocketService } from 'src/app/services/socket.service';
import { RoundProgressModule } from 'angular-svg-round-progressbar';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { CountdownComponent } from './components/countdown/countdown.component';
import { RoundComponent } from './components/round/round.component';

@NgModule({
  declarations: [AppComponent, HeaderComponent, FooterComponent, CountdownComponent, RoundComponent],
  imports: [BrowserModule, HttpClientModule, RoundProgressModule],
  providers: [SocketService],
  bootstrap: [AppComponent]
})
export class AppModule {}
