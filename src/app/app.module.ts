import { BrowserModule } from '@angular/platform-browser';
import { Injectable, NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { registerLocaleData } from '@angular/common';
import ptBr from '@angular/common/locales/pt';

import { AppRoutingModule } from './app.routing';
import { AppComponent, STYLES as APP_STYLES } from './app.component';
import { ViewsModule } from './views/views.module';
import { HttpClientModule } from '@angular/common/http';

import {
  HAMMER_GESTURE_CONFIG,
  HammerModule
} from '@angular/platform-browser';

import {
  LyTheme2,
  StyleRenderer,
  LY_THEME,
  LY_THEME_NAME,
  LyHammerGestureConfig,
  LyClasses,
  lyl,
  SelectorsFn
} from '@alyle/ui';

import { LyButtonModule } from '@alyle/ui/button';
import { LyToolbarModule } from '@alyle/ui/toolbar';
import { LyImageCropperModule } from '@alyle/ui/image-cropper';

import { MinimaLight, MinimaDark } from '@alyle/ui/themes/minima';
import { Color } from '@alyle/ui/color';

registerLocaleData(ptBr);

@Injectable()
export class CustomMinimaLight {
  name = 'minima-light';
  demoBg = new Color(0x8c8c8c);
}

@Injectable()
export class CustomMinimaDark {
  name = 'minima-dark';
  demoBg = new Color(); // Black
  exampleContainer: ((__: LyClasses<typeof APP_STYLES>)
    => (className: string) => string) | null = null;
}

@Injectable()
export class CustomMinimaDeepDark extends CustomMinimaDark {
  override name = 'minima-deep-dark';
  override exampleContainer = (__: LyClasses<typeof APP_STYLES>) => lyl`{
    ${__.exampleContainer} {
      box-shadow: 0px 0px 0px 2px #353535
      border-radius: 9px
      overflow: hidden
      background: none
    }
  }`
}

export type AppThemeVariables = MinimaLight
  & MinimaDark
  & CustomMinimaLight
  & CustomMinimaDark;

@NgModule({
  imports: [
    BrowserModule,
    ViewsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FontAwesomeModule,
    LyButtonModule,
    LyToolbarModule,
    LyImageCropperModule,
    HammerModule
  ],
  declarations: [
    AppComponent
  ],
  providers: [
    [LyTheme2],
    [StyleRenderer],
    // Theme that will be applied to this module
    { provide: LY_THEME_NAME, useValue: 'minima-light' },
    { provide: LY_THEME, useClass: MinimaLight, multi: true }, // name: `minima-light`
    { provide: LY_THEME, useClass: MinimaDark, multi: true }, // name: `minima-dark`
    // Gestures
    { provide: HAMMER_GESTURE_CONFIG, useClass: LyHammerGestureConfig } // Required for <ly-carousel>
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
