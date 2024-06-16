import { Component, ChangeDetectionStrategy, ChangeDetectorRef, Output, EventEmitter, Input } from '@angular/core';
import { LyDialog } from '@alyle/ui/dialog';
import { ImgCropperEvent } from '@alyle/ui/image-cropper';
import { CropperDialogComponent } from './cropper-dialog.component';

@Component({
  selector: 'aui-cropper-with-dialog',
  templateUrl: './cropper-with-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './cropper-with-dialog.component.scss'
})
export class CropperWithDialogComponent {
  @Input() cropped: string[] = [];
  @Output() croppedAction = new EventEmitter<string[]>();


  constructor(
    private _dialog: LyDialog,
    private _cd: ChangeDetectorRef
  ) { }

  openCropperDialog(event: Event) {
    this._dialog.open<CropperDialogComponent, Event>(CropperDialogComponent, {
      data: event,
      width: 320,
      disableClose: true
    }).afterClosed.subscribe((result?: ImgCropperEvent) => {
      if (result) {
        this.cropped?.push(result.dataURL as string);
        this._cd.markForCheck();
        this.croppedAction.emit(this.cropped);
      }
    });
  }

  removeCropped(index: number) {
    this.cropped?.splice(index, 1);
    this._cd.markForCheck();

    this.croppedAction.emit(this.cropped);
  }
}
