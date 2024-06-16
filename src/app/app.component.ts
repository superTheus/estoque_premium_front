import { Component } from '@angular/core';
import { SelectorsFn, StyleRenderer, ThemeVariables, WithStyles, lyl } from '@alyle/ui';
import { AppThemeVariables } from './app.module';

export const STYLES = (theme: AppThemeVariables, selectors: SelectorsFn) => {
  const __ = selectors(STYLES);
  return {
    $global: () => lyl`{
      body {
        background-color: ${theme.background.default}
        color: ${theme.text.default}
        font-family: ${theme.typography.fontFamily}
        margin: 0
        direction: ${theme.direction}
      }
      ...${theme.exampleContainer?.(__)
      }
    }`,
    root: lyl`{
      display: block
    }`,
    exampleContainer: null
  };
};

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [
    StyleRenderer
  ]
})
export class AppComponent implements WithStyles {
  title = 'estoque-premium';
  readonly classes = this.sRenderer.renderSheet(STYLES, true);
  constructor(
    readonly sRenderer: StyleRenderer
  ) { }
}
