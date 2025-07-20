import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {NgbPopover} from '@ng-bootstrap/ng-bootstrap';
import {map} from 'rxjs/operators';

interface Step {
  selector: string;
  title: string;
  description: string;
  listen?: ('click' | 'blur' | 'keyup' | 'change')[];
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
export class TutorialComponent implements OnInit, AfterViewInit, OnDestroy {
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
      selector: '#add-audit',
      title: 'Create an Audit',
      listen: ['click'],
      description: `
      Let's start by creating a new Audit.
      Click the 'Add Audit' button in the top left corner.
      `,
    },
    {
      selector: '#name',
      title: 'Enter Audit Name',
      listen: ['change'],
      description: `Enter the name of your Audit in the input field.`,
    },
    {
      selector: '#state',
      title: 'Select Audit State',
      listen: ['change'],
      description: `Select the state of your Audit from the dropdown menu.`,
    },
    {
      selector: '#feasibility-study',
      title: 'Enable Feasibility Study',
      listen: ['change'],
      description: `If your audit requires a feasibility study, e.g. for solar or electric vehicle charging, enable this option.`,
    },
    {
      selector: '#create-audit',
      title: 'Create Audit',
      listen: ['click'],
      description: `Click this button to create your Audit.`,
    },
    {
      selector: '#audit-list',
      title: 'Find your Audit',
      description: `You can find your newly created Audit in the list of Audits, under the state you selected.`,
    },
    {
      selector: '#audit-search',
      title: 'Search for Audits',
      description: `If you lost your Audit, you can search for it using the search bar at the top of the list.`,
      listen: ['change'],
    },
    {
      selector: '.btn.btn-link.bi-three-dots',
      title: 'End of Tutorial',
      description: "You're all set and done with the tutorial!",
    },
  ];

  index = 0;

  targetPosition = {top: 0, left: 0, width: 0, height: 0};

  onNext = () => this.router.navigate(['..', this.index + 1], {relativeTo: this.activatedRoute});
  cleanupElement?: () => void;

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

  ngOnDestroy() {
    this.cleanupElement?.();
  }

  async showStep(index: number) {
    this.cleanupElement?.();

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

    for (const event of step.listen ?? []) {
      element.addEventListener(event, this.onNext);
    }
    this.cleanupElement = () => {
      for (const event of step.listen ?? []) {
        element.removeEventListener(event, this.onNext);
      }
      this.cleanupElement = undefined;
    };

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
