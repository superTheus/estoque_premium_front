import { NgModule } from "@angular/core";
import { HeaderComponent } from "./header/header.component";

import { MenubarModule } from 'primeng/menubar';

@NgModule({
  declarations: [HeaderComponent],
  imports: [MenubarModule],
  exports: [HeaderComponent],
  providers: []
})
export class LayoutModule { }
