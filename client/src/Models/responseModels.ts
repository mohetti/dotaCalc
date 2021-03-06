export interface ItemValues {
  [key: string]: ItemValuesChild;
}

export interface ItemValuesChild {
  img: string;
  dname: string;
  id: number;
}

export interface HeroValues {
  [key: string]: HeroValuesChild;
}

export interface HeroValuesChild {
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
  primary_attr: 'agi' | 'int' | 'str';
  projectile_speed: number;
  str_gain: number;
  id: string;
}
