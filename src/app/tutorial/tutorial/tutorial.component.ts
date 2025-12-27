import {AfterViewInit, Component, inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {NgbPopover} from '@ng-bootstrap/ng-bootstrap';
import {switchMap} from 'rxjs';
import {map} from 'rxjs/operators';
import {Step, TutorialService} from '../tutorial.service';

function findPos(obj: HTMLElement): [number, number] {
  let top = 0;
  let left = 0;

  let parent: HTMLElement | null = obj;
  do {
    top += parent.offsetTop;
    left += parent.offsetLeft;

    if (parent.offsetParent instanceof HTMLElement) {
      parent = parent.offsetParent;
    } else {
      break;
    }
  } while (parent);
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

  private activatedRoute = inject(ActivatedRoute);
  private tutorialService = inject(TutorialService);
  private router = inject(Router);

  selector = '';
  step?: Step;
  nextEnabled = true;

  targetPosition = {top: 0, left: 0, width: 0, height: 0};

  onNext = () => this.router.navigate(['..', this.step?.next], {relativeTo: this.activatedRoute});
  cleanupElement?: () => void;

  ngOnInit(): void {
    this.activatedRoute.params.pipe(
      switchMap(({selector}) => this.tutorialService.getStep(selector).pipe(
        map(step => ({selector, step})),
      )),
    ).subscribe(({selector, step}) => {
      this.showStep(selector, step);
    });
  }

  ngAfterViewInit() {
    this.popover.open();
  }

  ngOnDestroy() {
    this.cleanupElement?.();
  }

  async showStep(selector: string, step: Step) {
    this.cleanupElement?.();

    this.selector = selector;
    this.step = step;
    if (step.route) {
      await this.router.navigate([step.route], {relativeTo: this.activatedRoute.parent});
    }

    this.nextEnabled = !!(step.next && document.querySelector(step.next));

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
