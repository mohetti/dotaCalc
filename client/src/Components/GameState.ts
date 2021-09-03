import { dataContainer } from '../index';
import {
  HeroValues,
  HeroValuesChild,
  ItemValuesChild,
} from '../Models/responseModels';
import { itemStats } from '../Models/heroStartItems/startItems';
import { HeroStatsForCalculation } from './Calculation';
import { ValuesForCalculation } from './Calculation';

export class GameState {
  heroObj: HeroValuesChild;
  heroItems: ItemValuesChild[];
  currentOpponent!: HeroValuesChild;
  opponentItems!: ItemValuesChild[];
  gameMode;
  heroKeys;
  startItems!: ItemValuesChild[];
  heroGold!: number;
  opponentGold!: number;

  constructor(heroId: string, gameMode: string) {
    this.gameMode = gameMode;

    // get hero
    this.heroObj = dataContainer.heroes.plainHeroObj(heroId);
    this.heroKeys = Object.keys(dataContainer.heroes.list as HeroValues);

    const heroIndex = this.heroKeys.indexOf(this.heroObj['id'].toString());
    this.heroKeys.splice(heroIndex, 1);

    // get hero items
    const itemKeys = Object.values(
      dataContainer.heroStartItems[this.heroObj['id']]
    );
    this.heroItems = dataContainer.items.plainItemObj(itemKeys);
    this.setGold(this.heroItems, 'heroGold');

    this.setCurrentOpponent();
    this.getOpponentItems();
    this.getStartItems();
  }

  initChange(newItem: string, oldItem: string, target: string) {
    if (target === 'hero') {
      this.setHeroItems(newItem, oldItem);
      this.setGold(this.heroItems, 'heroGold');
      return true;
    }
    if (target === 'opponent') {
      this.setOpponentItems(newItem, oldItem);
      this.setGold(this.opponentItems, 'opponentGold');
      return true;
    }
  }

  enoughGold(newItem: string, oldItem: string, target: string) {
    const goldCount =
      +this[target as keyof GameState] +
      itemStats[newItem].gold -
      itemStats[oldItem].gold;
    return goldCount < 601;
  }

  calcCycle(ownStats: ValuesForCalculation, enemyStats: ValuesForCalculation) {
    if (enemyStats.health <= 0) {
      return enemyStats;
    }
    let enemyDmgBlock;
    let _enemyArmor = enemyStats.armor - ownStats.armorDebuff;
    let _dmgBlock = (0.052 * _enemyArmor) / (0.9 + 0.048 * _enemyArmor);
    _enemyArmor < 0
      ? (enemyDmgBlock = 1 + _dmgBlock)
      : (enemyDmgBlock = 1 - _dmgBlock);

    let dmgPerHit;
    enemyStats.isMelee
      ? (dmgPerHit = ownStats.damage * enemyDmgBlock - 8)
      : (dmgPerHit = ownStats.damage * enemyDmgBlock);

    // first damage cycle
    let attacksNeeded =
      enemyStats.health / dmgPerHit < 1
        ? 1
        : Math.floor(enemyStats.health / dmgPerHit);
    let hpLeft = enemyStats.health - dmgPerHit * attacksNeeded;
    let timeItTakes = ownStats.atkPerSec * attacksNeeded;
    console.log(timeItTakes);

    hpLeft = hpLeft - Math.floor(timeItTakes) * ownStats.damageTemp;

    // health regen
    let hpNew!: number;
    if (enemyStats.tempHealthRegenDuration === 0) {
      let healthRegened = timeItTakes * enemyStats.healthRegen;
      hpNew = hpLeft + healthRegened;
    }
    if (timeItTakes <= enemyStats.tempHealthRegenDuration) {
      let healthRegened = timeItTakes * enemyStats.healthRegen;
      hpNew = hpLeft + healthRegened;
      enemyStats.tempHealthRegenDuration += -Math.floor(timeItTakes);
    }

    if (
      timeItTakes > enemyStats.tempHealthRegenDuration &&
      enemyStats.tempHealthRegenDuration !== 0
    ) {
      let healthRegened;
      let restRegen = enemyStats.tempHealthRegenDuration * 7.1875;
      enemyStats.tempHealthRegenDuration = 0;
      enemyStats.healthRegen += -7.1875;
      healthRegened = restRegen + enemyStats.healthRegen * timeItTakes;
      hpNew = hpLeft + healthRegened;
    }

    if (hpNew < enemyStats.health * 0.15) {
      if (enemyStats.heal > 0) {
        hpNew += 85;
        enemyStats.heal += -85;
        enemyStats.damage += -2;
      }
    }
    enemyStats.health = hpNew;
    enemyStats.time += timeItTakes;

    return enemyStats;
  }

  timeTillWin(
    ownStats: ValuesForCalculation,
    enemyStats: ValuesForCalculation
  ): any {
    let enemy = this.calcCycle(ownStats, enemyStats);
    let own = this.calcCycle(enemyStats, ownStats);

    if (own.health > 0 && enemy.health > 0) {
      return this.timeTillWin(own, enemy);
    }

    if (own.health < 0 && enemy.health > 0 && own.time < enemy.time) {
      console.log(own.health + ' hero health');
      console.log(own.time + ' hero time');
      console.log(enemy.health + ' enemy health');
      console.log(enemy.time + ' enemy time');
      return alert('You lost!');
    }

    if (own.health > 0 && enemy.health < 0 && own.time > enemy.time) {
      console.log(own.health + ' hero health');
      console.log(own.time + ' hero time');
      console.log(enemy.health + ' enemy health');
      console.log(enemy.time + ' enemy time');
      return alert('You won!');
    }

    if (own.health < 0 && enemy.health > 0 && own.time > enemy.time) {
      return this.timeTillWin(own, enemy);
    }

    if (own.health > 0 && enemy.health < 0 && own.time < enemy.time) {
      return this.timeTillWin(own, enemy);
    }

    if (own.health < 0 && enemyStats.health < 0) {
      console.log(own.health + ' hero health');
      console.log(own.time + ' hero time');
      console.log(enemy.health + ' enemy health');
      console.log(enemy.time + ' enemy time');
      return own.time < enemy.time ? alert('You won!') : alert('You lost!');
    }

    // if ownStats hp < 0 && enemyStats hp > 0 && timeItTakes > timeItTakes return enemy Winner

    // if ownStats hp > 0 && enemyStats hp < 0 && timeItTakes < timeItTakes return own Winner

    // if ownStats hp < 0 && enemStats hp > 0 && timeItTakes < timeItTakes calc timeTillEnemyDies keep timeTillOwnDies

    // if ownStats hp > 0 && enemyStats hp < 0 && timeItTakes > timeItTakes calc timeTillOwnDies keep timeTillEnemyDies

    // if ownStats hp < 0 && enemyStats hp < 0

    // heal > 0 - 2 dmg when used
    // dmgTemp => for each sec deal 2 dmg ontop
  }

  performCalculation() {
    const heroStats = HeroStatsForCalculation(this.heroObj, this.heroItems);
    const opponentStats = HeroStatsForCalculation(
      this.currentOpponent,
      this.opponentItems
    );
    this.timeTillWin(heroStats, opponentStats);
  }

  private setOpponentItems(newItem: string, oldItem: string) {
    let list = [];
    this.opponentItems.map((x) => {
      list.push(+x.id);
    });
    let index = this.opponentItems.findIndex((x) => {
      return x.id === +oldItem;
    });

    list[index] = +newItem;
    this.opponentItems = dataContainer.items.plainItemObj(list);
  }

  reset(
    goldTarget: 'heroGold' | 'opponentGold',
    itemsTarget: 'heroItems' | 'opponentItems'
  ) {
    const arrayForReset = [999, 999, 999, 999, 999, 999];
    this[itemsTarget] = dataContainer.items.plainItemObj(arrayForReset);
    this.setGold(this[itemsTarget], goldTarget);
  }

  private setHeroItems(newItem: string, oldItem: string) {
    let list = [];
    this.heroItems.map((x) => {
      list.push(+x.id);
    });
    let index = this.heroItems.findIndex((x) => {
      return x.id === +oldItem;
    });

    list[index] = +newItem;
    this.heroItems = dataContainer.items.plainItemObj(list);
  }

  setCurrentOpponent() {
    if (this.heroKeys.length === 0) {
      return alert('Finish');
    }
    const randomIndex = Math.floor(Math.random() * this.heroKeys.length);
    this.currentOpponent! = dataContainer.heroes.plainHeroObj(
      this.heroKeys[randomIndex].toString()
    );
    // remove opp from list of keys
    this.heroKeys.splice(randomIndex, 1);
  }

  getOpponentItems() {
    const oppItemKeys = Object.values(
      dataContainer.heroStartItems[this.currentOpponent['id']]
    );
    this.opponentItems = dataContainer.items.plainItemObj(oppItemKeys);
    this.setGold(this.opponentItems, 'opponentGold');
  }

  private getStartItems() {
    const itemKeys = Object.keys(itemStats);
    this.startItems = dataContainer.items.plainItemObj(itemKeys);
  }

  private setGold(
    items: ItemValuesChild[],
    target: 'heroGold' | 'opponentGold'
  ) {
    let gold = 0;
    items.map((x) => {
      if (x !== undefined) {
        gold += itemStats[x['id']].gold;
      }
    });

    this[target] = gold;
  }
}
