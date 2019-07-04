import { Component, HostListener, OnInit } from '@angular/core';
import { SocketService } from 'src/services/socket.service';
import { Subject } from 'rxjs';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  isConnected: boolean;
  countdownInProgress: boolean;
  roundInProgress: boolean;
  waitingForRound: boolean;
  resultsInProgress: boolean;
  roundStarting: boolean;
  currentBall: any;
  results: any[];
  odds: any[];
  balls: any[];
  counterTotal: number;
  countdown: number;
  loading: boolean;
  init: boolean;
  loadingSubject = new Subject<any>();
  $loadingObservable = this.loadingSubject.asObservable();

  constructor(private socketService: SocketService) {
    this.loading = true;
    this.init = true;
    this.socketService.socketData$.subscribe(
      socketData => {
        this.isConnected = socketData.isConnected;
        switch (socketData.type) {
          case 'state':
            if (socketData.data.type == 'countdown') {
              console.log('COUNTDOWN');
              this.odds = socketData.data.odds;
              this.waitingForRound = true;
              this.roundInProgress = false;
              this.countdownInProgress = false;
              this.resultsInProgress = false;
            }
            if (socketData.data.type == 'ball') {
              console.log('BALL');
              this.balls = socketData.data.balls;
              this.odds = socketData.data.odds;
              this.roundInProgress = true;
              this.waitingForRound = false;
              this.countdownInProgress = false;
              this.resultsInProgress = false;
              this.roundStarting = false;
            }
            if (socketData.data.type == 'new') {
              console.log('NEW');
              this.odds = socketData.data.odds;
              this.balls = socketData.data.balls;
              this.roundInProgress = false;
              this.waitingForRound = false;
              this.resultsInProgress = false;
              this.countdownInProgress = false;
              this.roundStarting = true;
            }
            if (socketData.data.type == 'results') {
              console.log('RESULTS');
              this.results = socketData.data.balls;
              this.roundInProgress = false;
              this.waitingForRound = false;
              this.resultsInProgress = true;
              this.countdownInProgress = false;
            }
            break;
          case 'new':
            console.log('NEW');
            this.balls = [];
            this.results = [];
            this.odds = socketData.data.odds;
            this.currentBall = undefined;
            this.roundInProgress = false;
            this.waitingForRound = false;
            this.resultsInProgress = false;
            this.countdownInProgress = false;
            this.roundStarting = true;
            break;
          case 'ball':
            console.log('BALL');
            this.currentBall = socketData.data;
            this.waitingForRound = false;
            this.roundStarting = false;
            this.roundInProgress = true;
            break;
          case 'results':
            console.log('RESULTS');
            this.results = socketData.data.balls;
            this.roundInProgress = false;
            this.countdownInProgress = false;
            this.waitingForRound = false;
            this.resultsInProgress = true;
            break;
          case 'countdown':
            console.log('COUNTDOWN');
            this.countdown = socketData.data.delay;
            this.counterTotal = socketData.data.delay;
            this.roundInProgress = false;
            this.resultsInProgress = false;
            this.countdownInProgress = true;
            break;
        }
        this.loading = false;
        this.loadingSubject.next();
      },
      err => {
        console.error(err);
        this.loading = false;
        this.loadingSubject.next();
      }
    );
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    if (window.innerWidth <= 500) {
      document
        .getElementById('center-placeholder')
        .appendChild(document.getElementById('center-balls'));
    } else {
      document
        .getElementById('center-main')
        .prepend(document.getElementById('center-balls'));
    }
  }

  ngOnInit() {
    this.$loadingObservable.pipe(take(1)).subscribe(() => {
      setTimeout(() => {
        if (this.init) {
          this.onResize();
          this.init = false;
        }
      }, 0);
    });
  }
}
