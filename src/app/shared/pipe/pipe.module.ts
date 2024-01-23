// import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SafePipe } from './safe.pipe';
import { PhotosPipe } from './photos.pipe';


@NgModule({
  declarations: [
    SafePipe,
    PhotosPipe
  ],
  // imports: [
  //   CommonModule,
  // ],
  exports: [
    SafePipe,
    PhotosPipe
  ],
  // providers: []
})
export class PipeModule {
}
