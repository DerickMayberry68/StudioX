import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppSettings } from '../../service/app-settings.service';
import { Router } from '@angular/router';

@Component({
	selector: 'error',
  templateUrl: './error.html',
  standalone: true,
  imports: [CommonModule]
})

export class ErrorPage implements OnDestroy {
  public router = inject(Router);

  goHome() {
    this.router.navigate(['/']);
  }
  
	constructor(public appSettings: AppSettings) {
    this.appSettings.appEmpty = true;
	}

  ngOnDestroy() {
    this.appSettings.appEmpty = false;
  }
}
