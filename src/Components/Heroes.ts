import { APIRequest } from './_APIRequest';
import { HeroAndItemRequirements } from '../Models/heroAndItemReqs';
import { Clickable } from '../Models/eventlisteners';
import { ResponseHeroValues } from '../Models/responseModels';

export class Heroes
  extends APIRequest
  implements HeroAndItemRequirements, Clickable
{
  heroList: ResponseHeroValues = {};
  images: number = 0;

  hostElement: HTMLDivElement = document.getElementById(
    'app'
  )! as HTMLDivElement;
  templateElement!: HTMLTemplateElement;
  element!: HTMLDivElement;

  protected static instance: Heroes;
  protected constructor(baseUrl: string, urlExtension: string) {
    super(baseUrl, urlExtension);
    this.modifyContents();
  }

  static getInstance() {
    if (this.instance) {
      return this.instance;
    }
    this.instance = new Heroes(
      'https://api.opendota.com/api',
      '/constants/heroes'
    );
    return this.instance;
  }
  async modifyContents() {
    const data = await this.getContents();
    const adjObj = {};
    for (const key in data) {
      this.heroList[data[key]['id']] = {
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
    this.renderContent();
    this.addListeners();
  }

  clickHandler(event: Event) {
    console.log((<HTMLElement>event.target).id);
  }
  addListeners() {
    Array.from(this.element.childNodes).forEach((child) => {
      child.addEventListener('click', this.clickHandler);
    });
  }

  renderContent() {
    this.templateElement = document.getElementById(
      'tmpl-hero-overview'
    )! as HTMLTemplateElement;
    const importedNode = document.importNode(
      this.templateElement.content,
      true
    );
    this.element = importedNode.firstElementChild as HTMLDivElement;
    this.element.id = 'hero-overview';
    for (const key in this.heroList) {
      const img = document.createElement('img');

      img.id = this.heroList[key].id.toString();

      img.classList.add('hero');
      img.onerror = () => {
        this.images += 1;

        if (this.images === 121) {
          this.hostElement.firstElementChild?.remove();
          this.hostElement.insertAdjacentElement('afterbegin', this.element);
        }
      };
      img.onload = () => {
        this.images += 1;

        if (this.images === 121) {
          this.hostElement.firstElementChild?.remove();
          this.hostElement.insertAdjacentElement('afterbegin', this.element);
        }
      };
      img.src = this.heroList[key].img;
      this.element.appendChild(img);
    }
  }
}
