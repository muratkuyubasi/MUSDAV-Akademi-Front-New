import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TruncatePipe } from './truncate.pipe';
import { SafePipe } from './safe.pipe';




@NgModule({
    declarations: [
        TruncatePipe,
        SafePipe,
    ],
    imports: [
        CommonModule
    ],
    exports: [
        TruncatePipe,
        SafePipe,
    ]
})
export class PipesModule { }
