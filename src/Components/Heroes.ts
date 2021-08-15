import { Draggable, DragTarget } from '../Models/eventlisteners';
import { HeroValues } from '../Models/responseModels';
import { Util } from './Util';
import { autobind } from '../Decorators/autobind';

export class Heroes implements Draggable, DragTarget {
  static instance: Heroes;
  hostElement: HTMLDivElement = document.getElementById(
    'app'
  )! as HTMLDivElement;
  templateElement: HTMLTemplateElement = document.getElementById(
    'tmpl-hero-overview'
  ) as HTMLTemplateElement;
  element: [HTMLDivElement, HTMLDivElement];

  heroes!: HeroValues;
  imagesLoaded: number = 0;

  constructor() {
    const importedNode = document.importNode(
      this.templateElement.content,
      true
    );
    this.element = Array.from(importedNode.children) as [
      HTMLDivElement,
      HTMLDivElement
    ];
  }

  async retrieveHeroes() {
    const data = await Util.getData(
      'https://api.opendota.com/api',
      '/constants/heroes'
    );
    this.heroes = data;

    for (const key in this.heroes) {
      this.heroes[data[key]['id']] = {
        img: 'https://api.opendota.com' + data[key]['img'],
        agi_gain: data[key]['agi_gain'],
        attack_range: data[key]['attack_range'],
        attack_rate: data[key]['attack_rate'],
        attack_type: data[key]['attack_type'],
        base_agi: data[key]['base_agi'],
        base_armor: data[key]['base_armor'],
        base_attack_max: data[key]['base_attack_max'],
        base_attack_min: data[key]['base_attack_min'],
        base_health: data[key]['base_health'],
        base_health_regen: data[key]['base_health_regen'],
        base_int: data[key]['base_int'],
        base_mana: data[key]['base_mana'],
        base_mana_regen: data[key]['base_mana_regen'],
        base_mr: data[key]['base_mr'],
        base_str: data[key]['base_str'],
        int_gain: data[key]['int_gain'],
        localized_name: data[key]['localized_name'],
        move_speed: data[key]['move_speed'],
        primary_attr: data[key]['primary_attr'],
        projectile_speed: data[key]['projectile_speed'],
        str_gain: data[key]['str_gain'],
        id: data[key]['id'],
      };
    }
  }

  render() {
    for (const key in this.heroes) {
      const img = document.createElement('img');
      img.id = this.heroes[key].id.toString();
      img.classList.add('hero');
      img.onerror = () => this.updateDOM();
      img.onload = () => this.updateDOM();
      img.src = this.heroes[key].img;
      this.element[0].appendChild(img);
    }
    this.configureDragDrop();
  }

  @autobind
  dragStartHandler(event: DragEvent) {
    event.dataTransfer!.setData('text/plain', (<HTMLElement>event.target).id);
    event.dataTransfer!.effectAllowed = 'copy';
  }

  @autobind
  dragEndHandler(_: DragEvent) {}
  @autobind
  dragOverHandler(event: DragEvent) {
    event.preventDefault();
    (<HTMLElement>event.target).classList.add('droppable');
  }

  @autobind
  dragLeaveHandler(event: DragEvent) {
    (<HTMLElement>event.target).classList.remove('droppable');
  }

  @autobind
  dropHandler(event: DragEvent) {
    event.preventDefault();
    const heroId = event.dataTransfer!.getData('text/plain');
    const img = document.createElement('img');
    img.id = this.heroes[event.dataTransfer!.getData('text/plain')]['id'];
    img.src = this.heroes[event.dataTransfer!.getData('text/plain')]['img'];
    if (this.element[1].firstElementChild?.firstElementChild) {
      this.element[1].firstElementChild?.firstElementChild.remove();
    }
    this.element[1].firstElementChild!.appendChild(img);
  }

  private configureDragDrop() {
    (<HTMLInputElement>this.element[0]).addEventListener(
      'dragstart',
      this.dragStartHandler
    );
    (<HTMLInputElement>this.element[0]).addEventListener(
      'dragend',
      this.dragEndHandler
    );
    (<HTMLInputElement>this.element[1].children[0]).addEventListener(
      'dragover',
      this.dragOverHandler
    );
    (<HTMLInputElement>this.element[1].children[0]).addEventListener(
      'dragleave',
      this.dragLeaveHandler
    );
    (<HTMLInputElement>this.element[1].children[0]).addEventListener(
      'drop',
      this.dropHandler
    );
  }

  private updateDOM() {
    this.imagesLoaded += 1;
    if (this.imagesLoaded === 121) {
      Array.from(this.hostElement.children).forEach((el) => {
        el.remove();
      });
      this.element.forEach((el) => {
        this.hostElement.insertAdjacentElement('beforeend', el);
      });
    }
  }

  // private function attach drag/drop listeners

  static getInstance() {
    if (this.instance) {
      return this.instance;
    }
    this.instance = new Heroes();
    return this.instance;
  }
}
