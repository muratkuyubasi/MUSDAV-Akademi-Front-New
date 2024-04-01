import { NgModule } from '@angular/core';
import { RouterModule,Routes } from '@angular/router';
import { AuthGuard } from '@core/security/auth.guard';
import { OfferListComponent } from './offer-list/offer-list.component';
import { OfferDetailResolverService } from './offer-detail-resolver';
import { ManageOfferComponent } from './manage-offer/manage-offer.component';

export const routes: Routes = [
    {
        path: '',
        component: OfferListComponent,
        data: { claimType: 'offer_list' },
        canActivate: [AuthGuard]
    },
    {
        path: 'manage/:id',
        component: ManageOfferComponent,
        resolve: { offer: OfferDetailResolverService },
        data: { claimType: 'offer_edit' },
        canActivate: [AuthGuard]
      }, {
        path: 'manage',
        component: ManageOfferComponent,
        data: { claimType: 'offer_add' },
        canActivate: [AuthGuard]
      },
]
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })

export class OfferRoutingModule{}