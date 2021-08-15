export abstract class Component<
  T extends HTMLElement,
  U extends HTMLElement[]
> {
  templateElement: HTMLTemplateElement;
  hostElement: T;
  element: U;

  constructor(templatedId: string, hostElementId: string) {
    this.templateElement = document.getElementById(
      templatedId
    )! as HTMLTemplateElement;
    this.hostElement = document.getElementById(hostElementId)! as T;

    const importedNode = document.importNode(
      this.templateElement.content,
      true
    );
    this.element = Array.from(importedNode.children) as U;
  }

  attach(atStart: boolean) {
    this.element.forEach((el) => {
      this.hostElement.insertAdjacentElement(
        atStart ? 'afterbegin' : 'beforeend',
        el
      );
    });
  }

  dispatch() {
    Array.from(this.hostElement.children).forEach((el) => {
      el.remove();
    });
  }
}
