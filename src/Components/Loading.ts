export class Loading {
  static instance: Loading;
  hostElement: HTMLDivElement = document.getElementById(
    'app'
  )! as HTMLDivElement;
  templateElement!: HTMLTemplateElement;
  element!: HTMLDivElement;
  constructor() {
    this.templateElement = document.getElementById(
      'tmpl-loading-screen'
    )! as HTMLTemplateElement;

    const importedNode = document.importNode(
      this.templateElement.content,
      true
    );
    this.element = importedNode.firstElementChild as HTMLDivElement;
    this.element.id = 'loading-screen';

    this.hostElement.insertAdjacentElement('afterbegin', this.element);
  }
  static getInstance() {
    if (this.instance) {
      return this.instance;
    }
    this.instance = new Loading();
    return this.instance;
  }
}
