import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-validation-message',
  templateUrl: './validation-message.component.html',
  styleUrls: ['./validation-message.component.css'],
  standalone: true,
})
export class ValidationMessageComponent implements OnInit {
  @Input('control')
  control: any;

  constructor() {}

  ngOnInit(): void {
    //console.log(this.control)
  }
}
