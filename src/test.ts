import axios from '../node_modules/axios/index';
import { startingItemsPerHero } from './startingItems';

class ManageState {
  private static instance: ManageState;
  private listenersForRender: any[] = [];
  private renderTarget!: string;

  private constructor() {}

  renderContent(templateId: string, array: any[]) {
    this.renderTarget = templateId;
    for (const listenerFn of this.listenersForRender) {
      listenerFn(this.renderTarget, array);
    }
  }

  addListener(listenerFn: Function) {
    this.listenersForRender.push(listenerFn);
  }

  static getInstance() {
    if (this.instance) {
      return this.instance;
    }
    this.instance = new ManageState();
    return this.instance;
  }
}

const manageState = ManageState.getInstance();

class ApiRequest {
  private static instance: ApiRequest;
  private openDotaBaseUrl: string = 'https://api.opendota.com/api';
  hostElement: HTMLDivElement;
  templateElement: HTMLTemplateElement;
  element: HTMLDivElement;

  private constructor() {
    this.hostElement = document.getElementById('app')! as HTMLDivElement;
    this.templateElement = document.getElementById(
      'tmpl-loading-screen'
    )! as HTMLTemplateElement;

    const importedNode = document.importNode(
      this.templateElement.content,
      true
    );
    this.element = importedNode.firstElementChild as HTMLDivElement;
    this.element.id = 'loading-screen';

    this.attach();

    Promise.all([this.getItems(), this.getHeroes()]).then((res) => {
      const responseHeroList = res[1].data;
      console.log(res[1].data);
      const adjustedHeroList: any = {};
      for (const key in responseHeroList) {
        adjustedHeroList[responseHeroList[key]['id']] = {
          img: responseHeroList[key]['img'],
        };
      }
      console.log(adjustedHeroList);

      manageState.renderContent('heroList', adjustedHeroList);
    });
  }

  static getInstance() {
    if (this.instance) {
      return this.instance;
    }
    this.instance = new ApiRequest();
    return this.instance;
  }

  getItems() {
    return axios.get(this.openDotaBaseUrl + '/constants/items');
  }

  getHeroes() {
    return axios.get(this.openDotaBaseUrl + '/constants/heroes');
  }

  private attach() {
    this.hostElement.insertAdjacentElement('afterbegin', this.element);
  }
}

const apiRequest = ApiRequest.getInstance();

class HeroList {
  private static instance: HeroList;
  hostElement!: HTMLDivElement;
  templateElement!: HTMLTemplateElement;
  element!: HTMLDivElement;

  private constructor() {
    this.hostElement = document.getElementById('app')! as HTMLDivElement;
    this.templateElement = document.getElementById(
      'tmpl-hero-overview'
    )! as HTMLTemplateElement;

    manageState.addListener((templateId: string, array: any[]) => {
      if (templateId === 'heroList') {
        const importedNode = document.importNode(
          this.templateElement.content,
          true
        );
        this.element = importedNode.firstElementChild as HTMLDivElement;
        this.element.id = 'hero-overview';

        for (const key in array) {
          const img = document.createElement('img');
          img.src = 'https://api.opendota.com' + array[key].img;
          this.element.appendChild(img);
        }

        this.attach();
      }
    });
  }
  private attach() {
    setTimeout(() => {
      this.hostElement.firstChild?.remove();
      this.hostElement.insertAdjacentElement('afterbegin', this.element);
    }, 2000);
  }

  heroList(obj: any) {}

  static getInstance() {
    if (this.instance) {
      return this.instance;
    }
    this.instance = new HeroList();
    return this.instance;
  }
}

const heroList = HeroList.getInstance();

// NEXT STEPS:
// have loading screen until get requests are finished
// render new with listener function
// display heroes, store heroe stats with id
// add click events and store newHeroes
