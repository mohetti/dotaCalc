import { Loading } from './Loading';
import { StartView } from './StartView';

export class Router {
  static loading() {
    Loading.getInstance();
  }
  static startView() {
    StartView.getInstance();
  }
  /*static gameView() {
    GameView.getInstance();
  }*/
}
