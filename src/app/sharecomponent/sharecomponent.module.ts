import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharecomponentRoutingModule } from './sharecomponent-routing.module';
import { HeaderComponent } from './header/header.component';


@NgModule({
  declarations: [HeaderComponent],
  imports: [
    CommonModule,
    SharecomponentRoutingModule
  ],exports:[HeaderComponent]
})
export class SharecomponentModule { }
