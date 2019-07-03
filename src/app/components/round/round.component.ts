import { Component, OnChanges, Input } from '@angular/core';

@Component({
  selector: 'app-round',
  templateUrl: './round.component.html',
  styleUrls: ['./round.component.scss']
})
export class RoundComponent implements OnChanges {
  @Input() results: any[];
  @Input() odds: any[];
  @Input() balls: any[];
  @Input() ball: any;
  @Input() waitingForRound: boolean;
  @Input() resultsInProgress: boolean;
  @Input() roundStarting: boolean;
  ballsToShow: any[] = [
    { index: 0, value: 0, isOdd: true },
    { index: 1, value: 0, isOdd: true },
    { index: 2, value: 0, isOdd: true },
    { index: 3, value: 0, isOdd: true },
    { index: 4, value: 0, isOdd: true },
    { index: 5, value: 0, isOdd: true },
    { index: 6, value: 0, isOdd: true },
    { index: 7, value: 0, isOdd: true },
    { index: 8, value: 0, isOdd: true },
    { index: 9, value: 0, isOdd: true },
    { index: 10, value: 0, isOdd: true },
    { index: 11, value: 0, isOdd: true },
    { index: 12, value: 0, isOdd: true },
    { index: 13, value: 0, isOdd: true },
    { index: 14, value: 0, isOdd: true },
    { index: 15, value: 0, isOdd: true },
    { index: 16, value: 0, isOdd: true },
    { index: 17, value: 0, isOdd: true },
    { index: 18, value: 0, isOdd: true },
    { index: 19, value: 0, isOdd: true },
    { index: 20, value: 0, isOdd: true },
    { index: 21, value: 0, isOdd: true },
    { index: 22, value: 0, isOdd: true },
    { index: 23, value: 0, isOdd: true },
    { index: 24, value: 0, isOdd: true },
    { index: 25, value: 0, isOdd: true },
    { index: 26, value: 0, isOdd: true },
    { index: 27, value: 0, isOdd: true },
    { index: 28, value: 0, isOdd: true },
    { index: 29, value: 0, isOdd: true },
    { index: 30, value: 0, isOdd: true },
    { index: 31, value: 0, isOdd: true },
    { index: 32, value: 0, isOdd: true },
    { index: 33, value: 0, isOdd: true },
    { index: 34, value: 0, isOdd: true }
  ];

  ngOnChanges() {
    if (!this.results || !this.results.length) {
      if (this.ball) {
        for (let i = 0; i < this.ballsToShow.length; i++) {
          if (this.ballsToShow[i].isOdd == true) {
            this.ballsToShow[i].value = this.ball.ball;
            this.ballsToShow[i].isOdd = false;
            break;
          }
        }
      }

      if (this.odds && !this.ballsToShow.find(x => x.isOdd == false)) {
        for (let i = 0; i < this.odds.length; i++) {
          this.ballsToShow[i].value = this.odds[i].odds;
          this.ballsToShow[i].isOdd = true;
        }
      }

      if (this.balls) {
        for (let i = 0; i < this.balls.length; i++) {
          this.ballsToShow[i].value = this.balls[i].ball;
          this.ballsToShow[i].isOdd = false;
        }
        if (!this.ball) {
          this.ball = this.balls[this.balls.length - 1];
        }
      }
    } else {
      for (let i = 0; i < this.results.length; i++) {
        this.ballsToShow[i].value = this.results[i].ball;
        this.ballsToShow[i].isOdd = false;
      }
    }
  }
}
