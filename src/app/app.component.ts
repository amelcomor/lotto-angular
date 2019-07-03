import { Component } from '@angular/core';
import { SocketService } from 'src/services/socket.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  isConnected: boolean;
  countdownInProgress;
  roundInProgress;
  waitingForRound;
  resultsInProgress;
  currentBall: any;
  results: any[];
  odds: any[];
  balls = [];
  counterTotal: number;
  countdown: number;
  loading;

  constructor(private socketService: SocketService) {
    this.loading = true;
    this.socketService.socketData$.subscribe(
      socketData => {
        this.isConnected = socketData.isConnected;
        switch (socketData.type) {
          case 'state':
            if (socketData.data.type == 'countdown') {
              this.odds = socketData.data.odds;
              this.waitingForRound = true;
              this.roundInProgress = false;
              this.countdownInProgress = false;
              this.resultsInProgress = false;
            }
            if (socketData.data.type == 'ball') {
              this.balls = socketData.data.balls;
              this.odds = socketData.data.odds;
              this.roundInProgress = true;
              this.waitingForRound = false;
              this.countdownInProgress = false;
              this.resultsInProgress = false;
            }
            if (socketData.data.type == 'new') {
              this.odds = socketData.data.odds;
              this.balls = socketData.data.balls;
              this.roundInProgress = false;
              this.waitingForRound = true;
              this.resultsInProgress = false;
              this.countdownInProgress = false;
            }
            if (socketData.data.type == 'results') {
              this.results = socketData.data.balls;
              this.roundInProgress = false;
              this.waitingForRound = false;
              this.resultsInProgress = true;
              this.countdownInProgress = false;
            }
            break;
          case 'new':
            this.balls = [];
            this.results = [];
            this.odds = socketData.data.odds;
            this.currentBall = undefined;
            this.roundInProgress = true;
            this.waitingForRound = true;
            this.resultsInProgress = false;
            this.countdownInProgress = false;
            break;
          case 'ball':
            this.currentBall = socketData.data;
            this.waitingForRound = false;
            break;
          case 'results':
            this.results = socketData.data.balls;
            this.roundInProgress = false;
            this.countdownInProgress = false;
            this.waitingForRound = false;
            this.resultsInProgress = true;
            break;
          case 'countdown':
            this.countdown = socketData.data.delay;
            this.counterTotal = socketData.data.delay;
            this.roundInProgress = false;
            this.resultsInProgress = false;
            this.countdownInProgress = true;
            break;
        }
        this.loading = false;
      },
      err => {
        console.error(err);
        this.loading = false;
      }
    );
  }
}
