import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {NgbPopover} from '@ng-bootstrap/ng-bootstrap';
import {map} from 'rxjs/operators';

interface Step {
  selector: string;
  title: string;
  description: string;
  route?: any[];
  skip?: number;
}

function findPos(obj: any): [number, number] {
  let top = 0;
  let left = 0;

  for (let parent = obj; parent; parent = parent.offsetParent) {
    top += parent.offsetTop;
    left += parent.offsetLeft;
  }
  return [top, left];
}

@Component({
  selector: 'app-tutorial',
  templateUrl: './tutorial.component.html',
  styleUrls: ['./tutorial.component.scss'],
  imports: [
    RouterLink,
    NgbPopover,
  ],
})
export class TutorialComponent implements OnInit, AfterViewInit {
  @ViewChild('popover') popover!: NgbPopover;

  steps: Step[] = [
    {
      selector: '#begin-tutorial',
      title: 'Tutorial',
      description: `
      Welcome to Conserve!
      This tutorial walks you through the different aspects and views of an Audit.
      Click 'Next' to continue to the next step, or '×' to skip the tutorial.
      `,
    },
    {
      selector: '.btn.btn-link.bi-three-dots',
      title: 'End of Tutorial',
      description: "You're all set and done with the tutorial, have fun with Projects!",
    },
  ];

  index = 0;

  targetPosition = {top: 0, left: 0, width: 0, height: 0};

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
  ) {
  }

  ngOnInit(): void {
    this.activatedRoute.params.pipe(
      map(({step}) => step),
    ).subscribe(step => {
      this.showStep(+step);
    });
  }

  ngAfterViewInit() {
    this.popover.open();
  }

  async showStep(index: number) {
    if (index >= this.steps.length) {
      return;
    }

    const step = this.steps[index];
    console.log('Tutorial step:', index, step);

    if (step.route) {
      await this.router.navigate(step.route, {relativeTo: this.activatedRoute.parent});
    }

    const element = document.querySelector(step.selector) as HTMLElement;
    if (!element) {
      return;
    }

    const [top, left] = findPos(element);
    this.targetPosition = {
      top,
      left,
      width: element.offsetWidth,
      height: element.offsetHeight,
    };
    this.index = index;
  }

  leave() {
    this.router.navigate(['../..'], {relativeTo: this.activatedRoute});
  }
}
