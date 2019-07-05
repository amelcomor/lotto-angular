import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit, OnChanges {
  @Input() ball: any;
  @Input() roundInProgress: boolean;
  @Input() countdownInProgress: boolean;
  @Input() resultsInProgress: boolean;
  @Input() roundStarting: boolean;
  @Input() balls: any[];
  @Input() results: any[];
  oddTotal: number;
  evenTotal: number;
  odds: number[];
  evens: number[];
  firstFiveSum: number;
  firstFiveSumIterrator: number;
  constructor() {}

  ngOnInit() {
    if (this.resultsInProgress) {
      this.balls = this.results;
    }
    this.initData();
    if (this.balls && this.balls.length > 0) {
      if (this.balls.length >= environment.overUnderLimit) {
        this.firstFiveSumIterrator = environment.overUnderLimit;
      } else {
        this.firstFiveSumIterrator = this.balls.length;
      }
      for (let i = 0; i < this.firstFiveSumIterrator; i++) {
        this.firstFiveSum += this.balls[i].ball;
      }
      const tempEvenOddTotal =
        this.balls.length >= environment.evenOddTotal
          ? environment.evenOddTotal
          : this.balls.length;
      for (let i = 0; i < tempEvenOddTotal; i++) {
        if (this.balls[i].ball % 2 == 0) {
          this.evens.push(this.balls[i].ball);
        } else {
          this.odds.push(this.balls[i].ball);
        }
      }
    }
  }

  initData() {
    this.oddTotal = 0;
    this.evenTotal = 0;
    this.firstFiveSum = 0;
    this.odds = [];
    this.evens = [];
    this.firstFiveSumIterrator = 0;
    this.initEvenOdd();
  }

  initEvenOdd() {
    for (let i = 1; i <= environment.evenOddTotal; i++) {
      if (Math.abs(i) % 2 === 1) {
        this.oddTotal++;
      } else {
        this.evenTotal++;
      }
    }
  }

  ngOnChanges() {
    if (this.countdownInProgress) {
      this.initData();
    } else {
      if (this.odds && this.evens && this.ball) {
        if (this.odds.length < this.oddTotal && this.ball.ball % 2 !== 0) {
          this.odds.push(this.ball.ball);
        }

        if (this.evens.length < this.evenTotal && this.ball.ball % 2 === 0) {
          this.evens.push(this.ball.ball);
        }

        if (this.firstFiveSumIterrator < environment.overUnderLimit) {
          this.firstFiveSum += this.ball.ball;
          this.firstFiveSumIterrator++;
        }
      }
    }
  }
}
