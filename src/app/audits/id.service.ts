import {Injectable} from '@angular/core';

@Injectable()
export class IdService {
  constructor() {
  }

  randomIdAndMod() {
    const mod = new Date().valueOf();
    const id = (mod / 1000) | 0;
    return {id, mod};
  }

  randomObjectId() {
    return (parseInt('local', 36) + Math.random()).toString(36);
  }
}
