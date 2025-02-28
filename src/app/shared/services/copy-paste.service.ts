import { Injectable } from "@angular/core";
import {map, Observable} from 'rxjs';
import {fromPromise} from 'rxjs/internal/observable/innerFrom';

@Injectable({providedIn: 'root'})
export class CopyPasteService {

  copy<T>(element: T, erasedKeys?: (keyof T)[]) {
    if (erasedKeys) {
      element = {...element};
      for (const key of erasedKeys) {
        delete element[key];
      }
    }

    const string = JSON.stringify(element);
    return fromPromise(navigator.clipboard.writeText(string));
  }

  paste<T>(requiredKeys: (keyof T)[]): Observable<T> {
    return fromPromise(navigator.clipboard.readText()).pipe(
      map(text => {
        const element = JSON.parse(text);
        const missingKey = requiredKeys.find(k => element[k] === undefined);
        if (missingKey) {
          throw new Error(`Missing key: ${missingKey.toString()}`);
        }
        return element;
      }),
    );
  }
}
