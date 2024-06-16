import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LyImageCropperModule } from '@alyle/ui/image-cropper';
import { LySliderModule } from '@alyle/ui/slider';
import { LyButtonModule } from '@alyle/ui/button';
import { LyIconModule } from '@alyle/ui/icon';
import { LyDialogModule } from '@alyle/ui/dialog';

import { CropperWithDialogComponent } from './cropper-with-dialog.component';
import { CropperDialogComponent } from './cropper-dialog.component';


@NgModule({
  declarations: [
    CropperWithDialogComponent,
    CropperDialogComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    LyImageCropperModule,
    LySliderModule,
    LyButtonModule,
    LyIconModule,
    LyDialogModule
  ],
  exports: [CropperWithDialogComponent]
})
export class CropperWithDialogModule { }
