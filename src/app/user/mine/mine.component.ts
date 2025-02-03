import { Component, Input, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-mine',
  templateUrl: './mine.component.html',
  styleUrls: ['./mine.component.css'],
  standalone: true,
})
export class MineComponent implements OnInit {
  @Input() secondsRemaining;
  timer: any;
  constructor(private api: UserService) {}

  ngOnInit(): void {}

  ngOnChanges() {
    if (this.secondsRemaining != null && this.secondsRemaining != undefined) {
      this.startCountdown();
    }
  }

  startCountdown() {
    // console.log(this.secondsRemaining)
    let that = this;
    this.timer = setInterval(function () {
      if (that.secondsRemaining <= 0) {
        clearInterval(this.timer);
        // document.getElementById("timer").innerHTML = "00:00:00";

        if (document.getElementById('imgSpin').classList.contains('box')) {
          document.getElementById('imgSpin').classList.remove('box');
        }
        return;
      }
      if (!document.getElementById('imgSpin').classList.contains('box')) {
        document.getElementById('imgSpin').classList.add('box');
      }
      var hours = Math.floor(that.secondsRemaining / 3600);
      var minutes = Math.floor((that.secondsRemaining % 3600) / 60);
      var seconds = that.secondsRemaining % 60;

      var formattedHours = (hours < 10 ? '0' : '') + hours;
      var formattedMinutes = (minutes < 10 ? '0' : '') + minutes;
      var formattedSeconds = (seconds < 10 ? '0' : '') + seconds;

      document.getElementById('timer').innerHTML =
        formattedHours + ':' + formattedMinutes + ':' + formattedSeconds;

      that.secondsRemaining--;
    }, 1000);
  }

  async mine() {
    let result: any = await this.api.mine();
    if (result) {
      if (result.status) {
        Swal.fire({
          text: result.message,
          icon: 'success',
        }).then(() => {
          location.reload();
        });
      } else {
        Swal.fire({
          text: result.message,
          icon: 'error',
        });
      }
    } else {
      Swal.fire({
        text: 'Some error occurred!',
        icon: 'error',
      });
    }
  }

  ngOnDestroy() {
    clearInterval(this.timer);
  }
}
