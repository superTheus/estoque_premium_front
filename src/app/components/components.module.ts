import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonDefaultComponent } from './button-default/button-default.component';
import { InputDefaultComponent } from './input-default/input-default.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SelectDefaultComponent } from './select-default/select-default.component';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputQuantityComponent } from './input-quantity/input-quantity.component';
import { ChartComponent } from './chart/chart.component';
import { DeniedComponent } from './denied/denied.component';
import { LyImageCropperModule } from '@alyle/ui/image-cropper';
import { LySliderModule } from '@alyle/ui/slider';
import { LyButtonModule } from '@alyle/ui/button';
import { LyIconModule } from '@alyle/ui/icon';
import { LyDialogModule } from '@alyle/ui/dialog';
import { CropperWithDialogModule } from './cropper-dialog/cropper-with-dialog.module';
import { ImageViewerComponent } from './image-viewer/image-viewer.component';

@NgModule({
  declarations: [
    ButtonDefaultComponent,
    InputDefaultComponent,
    SelectDefaultComponent,
    InputQuantityComponent,
    ChartComponent,
    DeniedComponent,
    ImageViewerComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FloatLabelModule,
    LyImageCropperModule,
    LySliderModule,
    LyButtonModule,
    LyIconModule,
    LyDialogModule,
    CropperWithDialogModule
  ],
  exports: [
    ButtonDefaultComponent,
    InputDefaultComponent,
    SelectDefaultComponent,
    InputQuantityComponent,
    ChartComponent,
    DeniedComponent,
    CropperWithDialogModule,
    ImageViewerComponent
  ]
})
export class ComponentsModule { }
