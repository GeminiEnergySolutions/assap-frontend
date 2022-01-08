import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {of} from 'rxjs';
import {switchMap, tap} from 'rxjs/operators';
import {CompanycamService} from '../../companycam/companycam.service';
import {Photo} from '../../companycam/model/photo';
import {Project} from '../../companycam/model/project';
import {AuditService} from '../audit.service';

@Component({
  selector: 'app-photos',
  templateUrl: './photos.component.html',
  styleUrls: ['./photos.component.scss'],
})
export class PhotosComponent implements OnInit {
  project?: Project;
  photos: Photo[] = [];

  files: File[] = [];

  constructor(
    private route: ActivatedRoute,
    private auditService: AuditService,
    private companycamService: CompanycamService,
  ) {
  }

  ngOnInit(): void {
    this.route.params.pipe(
      switchMap(({aid}) => this.auditService.findOne(aid)),
      switchMap(audit => audit ? this.companycamService.getProjects(audit.name) : of([])),
      tap(([project]) => this.project = project),
      switchMap(([project]) => project ? this.companycamService.getPhotos(project.id) : []),
    ).subscribe(photos => {
      this.photos = photos;
    });
  }

  setFiles(files: FileList) {
    this.files = Array.from(files);
  }
}
