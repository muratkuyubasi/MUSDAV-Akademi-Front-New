import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TranslateModule } from "@ngx-translate/core";
import { SharedModule } from "@shared/shared.module";
import { OfferRoutingModule } from "./offers.routing";
import { OfferListComponent } from "./offer-list/offer-list.component";
import { MaterialModule } from "@shared/material.module";
import { OfferDetailResolverService } from "./offer-detail-resolver";
import { ManageOfferComponent } from "./manage-offer/manage-offer.component";
import { AutocompleteLibModule } from "angular-ng-autocomplete";

@NgModule({
    imports:[
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        SharedModule,
        TranslateModule,
        OfferRoutingModule,
        MaterialModule,
        AutocompleteLibModule
    ],
    declarations:[
        OfferListComponent,
        ManageOfferComponent
    ],
    providers:[OfferDetailResolverService]

})

export class OfferModule {}