import { HeroValues } from '../Models/responseModels';
export class Heroes {
  list: HeroValues;

  constructor(apiResponse: HeroValues) {
    this.list = {};
    for (const key in apiResponse) {
      this.list[apiResponse[key]['id']] = {
        img: 'https://api.opendota.com' + apiResponse[key]['img'],
        agi_gain: apiResponse[key]['agi_gain'],
        attack_range: apiResponse[key]['attack_range'],
        attack_rate: apiResponse[key]['attack_rate'],
        attack_type: apiResponse[key]['attack_type'],
        base_agi: apiResponse[key]['base_agi'],
        base_armor: apiResponse[key]['base_armor'],
        base_attack_max: apiResponse[key]['base_attack_max'],
        base_attack_min: apiResponse[key]['base_attack_min'],
        base_health: apiResponse[key]['base_health'],
        base_health_regen: apiResponse[key]['base_health_regen'],
        base_int: apiResponse[key]['base_int'],
        base_mana: apiResponse[key]['base_mana'],
        base_mana_regen: apiResponse[key]['base_mana_regen'],
        base_mr: apiResponse[key]['base_mr'],
        base_str: apiResponse[key]['base_str'],
        int_gain: apiResponse[key]['int_gain'],
        localized_name: apiResponse[key]['localized_name'],
        move_speed: apiResponse[key]['move_speed'],
        primary_attr: apiResponse[key]['primary_attr'],
        projectile_speed: apiResponse[key]['projectile_speed'],
        str_gain: apiResponse[key]['str_gain'],
        id: apiResponse[key]['id'],
      };
    }
  }
  plainHeroObj(id: string) {
    return this.list[id];
  }
  getOpponents(gameMode: string, heroId: string) {
    if (gameMode === 'random') {
      const listClone = { ...this.list };
      delete listClone[+heroId];
      return listClone;
    }
    if (gameMode === 'choice') {
      return;
    }
  }
}
