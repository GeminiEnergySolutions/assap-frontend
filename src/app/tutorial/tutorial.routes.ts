import {Routes} from '@angular/router';
import {SelectElementComponent} from './select-element/select-element.component';
import {TutorialComponent} from './tutorial/tutorial.component';

export const routes: Routes = [
  {path: 'select', component: SelectElementComponent},
  {path: 't/:selector', component: TutorialComponent},
];
