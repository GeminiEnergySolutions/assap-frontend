import {Routes} from '@angular/router';
import {EditTutorialComponent} from './edit-tutorial/edit-tutorial.component';
import {EditTutorialsComponent} from './edit-tutorials/edit-tutorials.component';
import {SelectElementComponent} from './select-element/select-element.component';
import {TutorialComponent} from './tutorial/tutorial.component';

export const routes: Routes = [
  {path: 'select', component: SelectElementComponent},
  {path: 'edit/new', component: EditTutorialComponent},
  {path: 'edit/:selector', component: EditTutorialComponent},
  {path: 'edit', component: EditTutorialsComponent},
  {path: 't/:selector', component: TutorialComponent},
];
