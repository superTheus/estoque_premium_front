import { NgModule } from "@angular/core";
import { HeaderComponent } from "./header/header.component";

import { MenubarModule } from 'primeng/menubar';
import { AsideComponent } from "./aside/aside.component";
import { FooterComponent } from "./footer/footer.component";
import { CommonModule } from "@angular/common";

@NgModule({
  declarations: [HeaderComponent, AsideComponent, FooterComponent],
  imports: [
    CommonModule,
    MenubarModule,
  ],
  exports: [HeaderComponent, AsideComponent, FooterComponent],
  providers: []
})
export class LayoutModule { }
