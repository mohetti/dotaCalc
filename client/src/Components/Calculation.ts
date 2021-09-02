import { HeroValuesChild, ItemValuesChild } from '../Models/responseModels';
import { itemStats } from '../Models/heroStartItems/startItems';
import { ItemListStaticChilds } from '../Models/heroStartItems/_interfaces';
const atkSpeed90 = [
  'Centaur Warrunner',
  'Shadow Shaman',
  'Spectre',
  'Techies',
  'Tiny',
];

const atkSpeed110 = ['Juggernaut', 'Sand King', 'Storm Spirit', 'Visage'];
const atkSpeed115 = ['Dark Willow', 'Lion', 'Mirana', 'Slark', 'Venomancer'];
const atkSpeed120 = ['Abaddon', 'Lifestealer', 'Viper', 'Weaver'];
const atkSpeed125 = ['Broodmother', 'Gyrocopter'];

function calculateItemStats(relevantItems: ItemListStaticChilds[]) {
  let str = 0;
  let agi = 0;
  let int = 0;
  let bonusHealth = 0;
  let bonusHealthRegenPermanent = 0;
  let bonusHealthRegenTemp = 0;
  let healthRegenTempDuration = 0;
  let bonusArmor = 0;
  let dmgRaw = 0;
  let dmgTempValue = 0;
  let atkSpeedRaw = 0;
  let armorDebuff = 0;
  let heal = 0;

  relevantItems.map((x) => {
    if (x.strBonus) {
      str += x.strBonus;
    }
    if (x.agiBonus) {
      agi += x.agiBonus;
    }
    if (x.intBonus) {
      int += x.intBonus;
    }
    if (x.hpRaw) {
      bonusHealth += x.hpRaw;
    }
    if (x.hpRegenPermanent) {
      bonusHealthRegenPermanent += x.hpRegenPermanent;
    }
    if (x.hpRegenTemp) {
      if (bonusHealthRegenTemp === 0) {
        bonusHealthRegenTemp += x.hpRegenTemp;
      }
    }
    if (x.hpRegenDuration) {
      healthRegenTempDuration += x.hpRegenDuration * 3;
    }
    if (x.armorRaw) {
      bonusArmor += x.armorRaw;
    }
    if (x.dmgRaw) {
      dmgRaw += x.dmgRaw;
    }
    if (x.dmgTempValue) {
      if (dmgTempValue === 0) {
        dmgTempValue += x.dmgTempValue;
      }
    }
    if (x.attSpeedRaw) {
      atkSpeedRaw += x.attSpeedRaw;
    }
    if (x.armorDebuff) {
      if (armorDebuff === 0) {
        armorDebuff += x.armorDebuff;
      }
    }
    if (x.heal) {
      heal += x.heal;
    }
  });

  return {
    str,
    agi,
    int,
    bonusHealth,
    bonusHealthRegenPermanent,
    bonusHealthRegenTemp,
    healthRegenTempDuration,
    bonusArmor,
    dmgRaw,
    dmgTempValue,
    atkSpeedRaw,
    armorDebuff,
    heal,
  };
}

function getAtkSpeed(minionName: string) {
  let atkSpeed = 100;
  if (atkSpeed90.indexOf(minionName) !== -1) {
    return (atkSpeed = 90);
  }
  if (atkSpeed110.indexOf(minionName) !== -1) {
    return (atkSpeed = 110);
  }
  if (atkSpeed115.indexOf(minionName) !== -1) {
    return (atkSpeed = 115);
  }
  if (atkSpeed120.indexOf(minionName) !== -1) {
    return (atkSpeed = 120);
  }
  if (atkSpeed125.indexOf(minionName) !== -1) {
    return (atkSpeed = 125);
  }
  return atkSpeed;
}

export function HeroStatsForCalculation(
  minionObj: HeroValuesChild,
  minionItems: ItemValuesChild[]
) {
  let relevantItems: ItemListStaticChilds[] = [];
  minionItems.map((x) => {
    if (itemStats[x['id']]['relevantValues']) {
      return relevantItems.push(itemStats[x['id']]);
    }
  });
  const extraItemStats = calculateItemStats(relevantItems);
  console.log(minionObj);
  console.log(extraItemStats);

  let _strTotal = minionObj.base_str + extraItemStats.str;
  let health =
    minionObj.base_health + _strTotal * 20 + extraItemStats.bonusHealth;
  let healthRegen =
    minionObj.base_health_regen +
    _strTotal * 0.1 +
    extraItemStats.bonusHealthRegenPermanent +
    extraItemStats.bonusHealthRegenTemp;
  let tempHealthRegenDuration = extraItemStats.healthRegenTempDuration;
  let heal = extraItemStats.heal;

  let _agiTotal = minionObj.base_agi + extraItemStats.agi;
  let _rawArmorTotal = minionObj.base_armor + extraItemStats.bonusArmor;
  let armor = (_agiTotal * 1) / 6 + _rawArmorTotal;

  let _extraDamageItems =
    extraItemStats.dmgRaw + extraItemStats[minionObj['primary_attr']];
  let _damageFromHeroStats;
  minionObj.primary_attr === 'str'
    ? (_damageFromHeroStats = minionObj.base_str)
    : minionObj.primary_attr === 'agi'
    ? (_damageFromHeroStats = minionObj.base_agi)
    : (_damageFromHeroStats = minionObj.base_int);
  let damage =
    (minionObj.base_attack_max + minionObj.base_attack_min) / 2 +
    _damageFromHeroStats +
    _extraDamageItems;

  let damageTemp = extraItemStats.dmgTempValue;
  let armorDebuff = extraItemStats.armorDebuff;

  let _getAtkSpeed = getAtkSpeed(minionObj.localized_name);

  let atkPerSec = (_getAtkSpeed + _agiTotal) / (100 * minionObj.attack_rate);

  let isMelee = minionObj.attack_type === 'Melee';

  const obj = {
    health,
    healthRegen,
    tempHealthRegenDuration,
    heal,
    armor,
    damage,
    damageTemp,
    armorDebuff,
    atkPerSec,
    isMelee,
  };
  console.log(obj);
  return obj;
}

// for the returned object:
// damage Temp comes ontop without calculations
// armorDebuff is needed in calculation of opponents damage reduction
// when heal is activated => remove 2 damage from variable damage and recalculate damage reduction
