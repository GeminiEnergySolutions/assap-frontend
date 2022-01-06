import {Component, Input, OnInit} from '@angular/core';
import {switchMap, tap} from 'rxjs/operators';
import {CompanycamService} from '../../companycam/companycam.service';
import {Photo} from '../../companycam/model/photo';
import {Project} from '../../companycam/model/project';
import {Audit} from '../model/audit.interface';

@Component({
  selector: 'app-photos',
  templateUrl: './photos.component.html',
  styleUrls: ['./photos.component.scss'],
})
export class PhotosComponent implements OnInit {
  @Input() audit!: Audit;

  project?: Project;
  photos: Photo[] = [];

  constructor(
    private companycamService: CompanycamService,
  ) {
  }

  ngOnInit(): void {
    this.companycamService.getProjects(this.audit.name).pipe(
      tap(([project]) => this.project = project),
      switchMap(([project]) => this.companycamService.getPhotos(project.id)),
    ).subscribe(photos => {
      this.photos = photos;
    });
  }

}
