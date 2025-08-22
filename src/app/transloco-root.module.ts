import {TRANSLOCO_CONFIG,TRANSLOCO_LOADER,TranslocoModule, translocoConfig} from '@ngneat/transloco';
import { Injectable, NgModule } from '@angular/core';
import { TranslocoHttpLoader } from '../app/transloco.loader';

@NgModule({
  exports: [TranslocoModule],
  providers: [
    {
      provide: TRANSLOCO_CONFIG,
      useValue: translocoConfig({
        availableLangs: ['en', 'fr'],
        defaultLang: 'en',
        reRenderOnLangChange: true,
        prodMode: false,
      }),
    },
    { provide: TRANSLOCO_LOADER, useClass: TranslocoHttpLoader },
  ],
})
export class TranslocoRootModule { }
