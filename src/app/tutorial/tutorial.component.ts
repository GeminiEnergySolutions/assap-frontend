import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {NgbPopover} from '@ng-bootstrap/ng-bootstrap';
import {map} from 'rxjs/operators';

interface Step {
  title: string;
  description: string;
  listen?: ('click' | 'blur' | 'keyup' | 'change')[];
  route?: any[];
  next?: string;
  skip?: string;
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

  steps: Record<string, Step> = {
    '#begin-tutorial': {
      title: 'Tutorial',
      description: `
      Welcome to Conserve!
      This tutorial walks you through the different aspects and views of an Audit.
      Click 'Next' to continue to the next step, or '×' to skip the tutorial.
      `,
      next: '#add-audit',
    },
    '#add-audit': {
      title: 'Create an Audit',
      listen: ['click'],
      description: `
      Let's start by creating a new Audit.
      Click the 'Add Audit' button in the top left corner.
      `,
      next: '#audit-name',
      skip: '#audit-list',
    },
    '#audit-name': {
      title: 'Enter Audit Name',
      listen: ['change'],
      description: `Enter the name of your Audit in the input field.`,
      next: '#audit-state',
    },
    '#audit-state': {
      title: 'Select Audit State',
      listen: ['change'],
      description: `Select the state of your Audit from the dropdown menu.`,
      next: '#feasibility-study',
    },
    '#feasibility-study': {
      title: 'Enable Feasibility Study',
      listen: ['change'],
      description: `If your audit requires a feasibility study, e.g. for solar or electric vehicle charging, enable this option.`,
    },
    '#create-audit': {
      title: 'Create Audit',
      listen: ['click'],
      description: `Click this button to create your Audit.`,
      next: '#audit-list',
    },
    '#audit-list': {
      title: 'Find your Audit',
      description: `You can find your newly created Audit in the list of Audits, under the state you selected.`,
      next: '#audit-search',
    },
    '#audit-search': {
      title: 'Search for Audits',
      description: `If you lost your Audit, you can search for it using the search bar at the top of the list.`,
      listen: ['change'],
      next: '.navbar',
    },
    '.navbar': {
      title: 'End of Tutorial',
      description: "You're all set and done with the tutorial!",
    },
  };

  selector = '';
  step?: Step;

  targetPosition = {top: 0, left: 0, width: 0, height: 0};

  onNext = () => this.router.navigate(['..', this.step?.next], {relativeTo: this.activatedRoute});
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
      this.showStep(step);
    });
  }

  ngAfterViewInit() {
    this.popover.open();
  }

  ngOnDestroy() {
    this.cleanupElement?.();
  }

  async showStep(selector: string) {
    this.cleanupElement?.();

    const step = this.steps[selector];
    if (!step) {
      return;
    }

    this.selector = selector;
    this.step = step;
    if (step.route) {
      await this.router.navigate(step.route, {relativeTo: this.activatedRoute.parent});
    }

    const element = document.querySelector(selector) as HTMLElement;
    if (!element) {
      return;
    }

    element.scrollIntoView();
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
  }

  leave() {
    this.router.navigate(['../..'], {relativeTo: this.activatedRoute});
  }
}
