import { Component, OnInit, Input, ViewChild, ElementRef, AfterViewInit, HostListener } from '@angular/core';
import { Observable } from 'rxjs';
import {
  MatDialog,
  MatDialogConfig,
  MatDialogRef,
} from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';

const enum Status {
  OFF = 0,
  RESIZE = 1,
  MOVE = 2
}

@Component({
  selector: 'app-resizable-draggable',
  templateUrl: './resizable-draggable.component.html',
  styleUrls: ['./resizable-draggable.component.scss']
})
export class ResizableDraggableComponent  { // implements OnInit, AfterViewInit
  @Input('width') public width: number;
  @Input('height') public height: number;
  @Input('left') public left: number;
  @Input('top') public top: number;
  @Input('prop') public prop: string;
  @Input('value') public value: string;
  px: number;
  py: number;
  minArea: number;
  draggingCorner: boolean;
  draggingWindow: boolean;
  // tslint:disable-next-line:ban-types
  resizer: Function;

  simpleDialog: MatDialogRef<DialogComponent>;

  constructor(private dialogModel: MatDialog) {
    this.px = 0;
    this.py = 0;
    this.draggingCorner = false;
    this.draggingWindow = false;
    this.minArea = 20000;
  }

  area() {
    return this.width * this.height;
  }

  onWindowPress(event: MouseEvent) {
    this.draggingWindow = true;
    this.px = event.clientX;
    this.py = event.clientY;
  }

  onWindowDrag(event: MouseEvent) {
    if (!this.draggingWindow) {
        return;
    }
    const offsetX = event.clientX - this.px;
    const offsetY = event.clientY - this.py;

    this.left += offsetX;
    this.top += offsetY;
    this.px = event.clientX;
    this.py = event.clientY;
  }

  topLeftResize(offsetX: number, offsetY: number) {
    this.left += offsetX;
    this.top += offsetY;
    this.width -= offsetX;
    this.height -= offsetY;
  }

  topRightResize(offsetX: number, offsetY: number) {
    this.top += offsetY;
    this.width += offsetX;
    this.height -= offsetY;
  }

  bottomLeftResize(offsetX: number, offsetY: number) {
    this.left += offsetX;
    this.width -= offsetX;
    this.height += offsetY;
  }

  bottomRightResize(offsetX: number, offsetY: number) {
    this.width += offsetX;
    this.height += offsetY;
  }

  // tslint:disable-next-line:ban-types
  onCornerClick(event: MouseEvent, resizer?: Function) {
    this.draggingCorner = true;
    this.px = event.clientX;
    this.py = event.clientY;
    this.resizer = resizer;
    event.preventDefault();
    event.stopPropagation();
  }

  @HostListener('document:mousemove', ['$event'])
  onCornerMove(event: MouseEvent) {
    if (!this.draggingCorner) {
        return;
    }
    const offsetX = event.clientX - this.px;
    const offsetY = event.clientY - this.py;

    const lastX = this.left;
    const lastY = this.top;
    const pWidth = this.width;
    const pHeight = this.height;

    this.resizer(offsetX, offsetY);
    const area = this.area();
    if (area < this.minArea) {
        this.left = lastX;
        this.top = lastY;
        this.width = pWidth;
        this.height = pHeight;
    }
    this.px = event.clientX;
    this.py = event.clientY;
  }

  @HostListener('document:mouseup', ['$event'])
  onCornerRelease(event: MouseEvent) {
    this.draggingWindow = false;
    this.draggingCorner = false;
  }


  dialog(): void {
    this.simpleDialog = this.dialogModel.open(DialogComponent,
      {
        data: {
          prop: this.prop,
          value: this.value,
        }
      });
  }

}
