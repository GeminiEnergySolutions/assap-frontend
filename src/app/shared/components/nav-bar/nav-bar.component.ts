import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit {

  menuCollapsed: boolean = true;

  constructor(public authService: AuthService,
    private router: Router,
    ) { }

  ngOnInit(): void {
  }

  logout(): void {
    this.authService.logout().subscribe((res: any) => {
      localStorage.clear();
      this.authService.currentLoginUser = {};
      this.router.navigate(['/auth/login']);
    })
  }
}
