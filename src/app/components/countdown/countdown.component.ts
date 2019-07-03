import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-countdown',
  templateUrl: './countdown.component.html',
  styleUrls: ['./countdown.component.scss']
})
export class CountdownComponent implements OnInit {
  @Input() counterTotal;
  @Input() countdown;
  counter = { minutes: '', seconds: '' };

  ngOnInit() {
    this.countTime();
  }

  countTime() {
    this.counter.minutes = Math.floor(this.countdown / 60).toString();
    this.counter.seconds = (this.countdown % 60).toString();
    setInterval(() => {
      if (this.countdown >= 0) {
        this.counter.minutes = Math.floor(this.countdown / 60).toString();
        this.counter.seconds = (this.countdown % 60).toString();
        if (parseInt(this.counter.seconds, 10) < 10) {
          this.counter.seconds = `0${this.counter.seconds}`;
        }
        this.countdown--;
      }
    }, 1000);
  }
}
