import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PaginationEvent } from 'src/app/models/pagination-event';

@Component({
  selector: 'app-user-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css'],
})
export class UserPaginationComponent implements OnInit {
  displayPageNos: number[] = new Array();
  p: PaginationEvent = { pageNo: 1, pageSize: 10 };
  total: number;
  maxPageNo: number;
  dirc: string = '';
  arrPageSize: number[] = [10, 20, 50, 100, 250];
  constructor() {}

  @Input()
  get recordsCount(): number {
    return this.total;
  }
  set recordsCount(recordsCount: number) {
    this.total = recordsCount;
    this.maxPageNo = Math.ceil(this.total / this.p.pageSize);
    if (this.maxPageNo) this.getDisplayPages();
  }

  @Output() paginationEvent = new EventEmitter<PaginationEvent>();
  ngOnInit(): void {}

  emit() {
    this.getDisplayPages();
    console.log(this.p);
    this.paginationEvent.emit(this.p);
  }

  onPageChange(e: Event) {
    let el = e.target as Element;
    let val = el.innerHTML;

    if (val && !this.isNumber(val)) return;

    if (val && this.isNumber(val)) {
      this.p.pageNo = Number.parseInt(val);
    } else {
      val = el.getAttribute('val') as string;
      if (
        (this.p.pageNo == 1 && val == 'prev') ||
        (this.p.pageNo == this.maxPageNo && val == 'next')
      )
        return;
      this.p.pageNo = this.p.pageNo + (val == 'next' ? 1 : -1);
    }
    this.emit();
  }

  onPageSizeChange(e: Event) {
    let elem = e.target as HTMLSelectElement;
    let val = Number.parseInt(elem.value);
    if (val == this.p.pageSize) return;
    if (val <= this.total) this.p.pageSize = val;
    else {
      this.p.pageSize = Math.max.apply(
        Math,
        this.arrPageSize.map(function (o) {
          return o;
        }),
      );
    }
    this.p.pageNo = 1;
    this.maxPageNo = Math.ceil(this.total / this.p.pageSize);
    this.emit();
  }

  getDisplayPages() {
    this.displayPageNos = [];
    if (this.maxPageNo <= 2) return;

    let arrSize = 6;
    let arrStart = 1,
      arrEnd = this.maxPageNo;
    if (this.maxPageNo < arrSize) {
      arrStart = 2;
      arrEnd = this.maxPageNo - 1;
    } else {
      let d = this.maxPageNo - this.p.pageNo - this.maxPageNo / 2;

      if (d > 0 && 1 + arrSize / 2 > this.p.pageNo) {
        arrStart = 2;
        arrEnd = arrStart + arrSize / 2;
        this.dirc = 'up';
      } else if (d < 0 && this.maxPageNo - arrSize / 2 < this.p.pageNo) {
        arrStart = this.maxPageNo - arrSize / 2 - 1;
        arrEnd = arrStart + arrSize / 2;
        this.dirc = 'down';
      } else {
        arrStart = this.p.pageNo - 1;
        arrEnd = this.p.pageNo + 1;
        this.dirc = 'mid';
      }
    }
    for (let i = arrStart; i <= arrEnd; i++) this.displayPageNos.push(i);
  }

  isNumber(val: any) {
    return !isNaN(Number(val));
  }
}
