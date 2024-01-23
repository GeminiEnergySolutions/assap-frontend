import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  template: '', // This component doesn't need a template
})
export class HomeRedirectComponent implements OnInit {
  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    const loggedIn = this.route.snapshot.data.loggedIn;
    const redirectTo = loggedIn ? '/audits' : '/auth/login';
    this.router.navigate([redirectTo]);
  }
}
