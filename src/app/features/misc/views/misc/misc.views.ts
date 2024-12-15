import { Component, effect, inject } from '@angular/core';
import { DialogComponent } from '../../../../shared/components/dialog/dialog.components';
import { Misc } from '../../../../shared/types/profile';
import { MiscFormComponent } from '../../forms/misc/misc.forms';
import { MiscService } from '../../services/misc.services';
import { ProfileDataService } from '../../../profile/services/profile-data.services';
import { SvgIconComponent } from 'angular-svg-icon';

@Component({
  selector: 'app-misc',
  imports: [DialogComponent, MiscFormComponent, SvgIconComponent],
  templateUrl: './misc.views.html',
  styleUrl: './misc.views.css',
})
export class MiscViewsComponent {
  private profileService = inject(ProfileDataService);
  private miscService = inject(MiscService);
  misc: Misc[] = [];
  isOpen: boolean = false;
  selectedProfile: string = '';

  constructor() {
    effect(() => {
      this.selectedProfile = this.profileService.selectedProfile();
      this.misc = this.miscService.misc();
    });
  }

  openDialog() {
    this.isOpen = true;
  }

  closeDialog() {
    this.isOpen = false;
  }

  addMisc(misc: Misc) {
    this.miscService.addMisc(misc);
    this.closeDialog();
  }

  deleteMisc(id: string) {
    this.miscService.deleteMisc(id);
  }
}
