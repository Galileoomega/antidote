import { ResolveFn } from '@angular/router';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';

const DELAY_MS = 300;

export const delayResolver: ResolveFn<null> = () => {
  return of(null).pipe(delay(DELAY_MS));
};
