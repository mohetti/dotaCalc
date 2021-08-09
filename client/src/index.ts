import axios, { AxiosPromise } from '../node_modules/axios/index';

interface HeroList {
  [key: string]: {
    img: string;
    agi_gain: number;
    attack_range: number;
    attack_rate: number;
    attack_type: string;
    base_agi: number;
    base_armor: number;
    base_attack_max: number;
    base_attack_min: number;
    base_health: number;
    base_health_regen: number;
    base_int: number;
    base_mana: number;
    base_mana_regen: number;
    base_mr: number;
    base_str: number;
    int_gain: number;
    localized_name: string;
    move_speed: number;
    primary_attr: string;
    projectile_speed: number;
    str_gain: number;
    id: number;
  };
}

interface ItemList {
  [key: string]: {
    img: string;
    dname: string;
    id: number;
  };
}

class APIRequest {
  responsePromise: AxiosPromise;
  protected constructor(baseUrl: string, urlExtension: string) {
    this.responsePromise = axios(baseUrl + urlExtension);
  }

  async getContents() {
    const response = await this.responsePromise;
    return response.data;
  }
}

abstract class HeroAndItemRequirements {
  abstract modifyContents(): void;
  abstract renderContent(): void;
}

interface Clickable {
  clickHandler(event: Event): void;
}

class Loading {
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

const loading = Loading.getInstance();

class Heroes extends APIRequest implements HeroAndItemRequirements, Clickable {
  heroList: HeroList = {};
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

const heroes = Heroes.getInstance();

class Items extends APIRequest implements HeroAndItemRequirements {
  protected static instance: Items;
  itemList: ItemList = {};
  protected constructor(baseUrl: string, urlExtension: string) {
    super(baseUrl, urlExtension);
    this.modifyContents();
  }

  static getInstance() {
    if (this.instance) {
      return this.instance;
    }
    this.instance = new Items(
      'https://api.opendota.com/api',
      '/constants/items'
    );
    return this.instance;
  }
  async modifyContents() {
    const data = await this.getContents();
    for (const key in data) {
      this.itemList[data[key]['id']] = {
        img: data[key]['img'],
        dname: data[key]['dname'],
        id: data[key]['id'],
      };
    }
  }
  renderContent() {}
}

const items = Items.getInstance();
