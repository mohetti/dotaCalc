export class Loading {
  static instance: Loading;
  hostElement: HTMLDivElement = document.getElementById(
    'app'
  )! as HTMLDivElement;
  templateElement: HTMLTemplateElement = document.getElementById(
    'tmpl-loading-screen'
  ) as HTMLTemplateElement;
  element!: HTMLDivElement;

  constructor() {
    const importedNode = document.importNode(
      this.templateElement.content,
      true
    );
    this.element = importedNode.firstElementChild as HTMLDivElement;
    this.render();
  }

  render() {
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
