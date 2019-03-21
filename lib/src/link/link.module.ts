import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LinkService } from './link.service';

@NgModule({
  imports: [
    CommonModule
  ],
  providers: [LinkService]
})
export class LinkModule { }
