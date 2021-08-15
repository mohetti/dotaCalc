import { Component } from './Component';

export class Loading extends Component<HTMLDivElement, HTMLDivElement[]> {
  static instance: Loading;

  constructor() {
    super('tmpl-loading-screen', 'app');
    this.attach(true);
  }

  static getInstance() {
    if (this.instance) {
      return this.instance;
    }
    this.instance = new Loading();
    return this.instance;
  }
}
