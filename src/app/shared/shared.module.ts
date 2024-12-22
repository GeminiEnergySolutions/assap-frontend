import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {NgbDropdownModule} from '@ng-bootstrap/ng-bootstrap';
import {MasterDetailComponent} from './components/master-detail/master-detail.component';
import {OptionDropdownComponent} from './components/option-dropdown/option-dropdown.component';
import {SafePipe} from './pipe/safe.pipe';
import {FeatureCardComponent} from './components/feature-card/feature-card.component';
import {ProgressBarComponent} from './components/progress-bar/progress-bar.component';
import {PhotoCaptureComponent} from './components/photo-capture/photo-capture.component';
import {EvalPipe} from './pipe/eval.pipe';
import {ExpressionErrorPipe} from './pipe/expression-error.pipe';


@NgModule({
  declarations: [
    MasterDetailComponent,
    OptionDropdownComponent,
    FeatureCardComponent,
    ProgressBarComponent,
    PhotoCaptureComponent,
    SafePipe,
    EvalPipe,
    ExpressionErrorPipe,
  ],
  imports: [
    CommonModule,
    RouterModule,
    NgbDropdownModule,
  ],
  exports: [
    MasterDetailComponent,
    OptionDropdownComponent,
    FeatureCardComponent,
    ProgressBarComponent,
    PhotoCaptureComponent,
    SafePipe,
    EvalPipe,
    ExpressionErrorPipe,
  ],
})
export class SharedModule {
}
