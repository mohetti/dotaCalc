import { Heroes, ItemsEnum } from './_enums';
import { heroItemSlots, ItemListStatic } from './_interfaces';

export const itemStats: ItemListStatic = {
  [ItemsEnum['Clarity']]: {
    relevantValues: true,
    gold: 50,
    manaRegenTemp: 6,
    manaRegenDuration: 25,
  },
  [ItemsEnum['Dust of Appearance']]: {
    relevantValues: false,
    gold: 80,
  },
  [ItemsEnum['Enchanted Mango']]: {
    relevantValues: true,
    gold: 70,
    hpRegenPermanent: 0.6,
    manaRegenTemp: 100,
    manaRegenDuration: 1,
  },
  [ItemsEnum['Faerie Fire']]: {
    relevantValues: true,
    gold: 70,
    heal: 85,
    dmgRaw: 2,
  },
  [ItemsEnum['Healing Salve']]: {
    relevantValues: false,
    gold: 110,
    hpRegenTemp: 40,
    hpRegenDuration: 10,
  },
  [ItemsEnum['Sentry Ward']]: {
    relevantValues: false,
    gold: 50,
  },
  [ItemsEnum['Observer Ward']]: {
    relevantValues: false,
    gold: 0,
  },
  [ItemsEnum['Smoke of Deceit']]: {
    relevantValues: false,
    gold: 50,
  },
  [ItemsEnum['Tango']]: {
    relevantValues: true,
    gold: 90,
    hpRegenTemp: 7.1875,
    hpRegenDuration: 16,
  },
  [ItemsEnum['Band of Elvenskin']]: {
    relevantValues: true,
    gold: 450,
    agiBonus: 6,
  },
  [ItemsEnum['Belt of Strength']]: {
    relevantValues: true,
    gold: 450,
    strBonus: 6,
  },
  [ItemsEnum['Circlet']]: {
    relevantValues: true,
    gold: 155,
    strBonus: 2,
    agiBonus: 2,
    intBonus: 2,
  },
  [ItemsEnum['Crown']]: {
    relevantValues: true,
    gold: 450,
    strBonus: 4,
    agiBonus: 4,
    intBonus: 4,
  },
  [ItemsEnum['Gauntlets of Strength']]: {
    relevantValues: true,
    gold: 140,
    strBonus: 3,
  },
  [ItemsEnum['Iron Branch']]: {
    relevantValues: true,
    gold: 50,
    strBonus: 1,
    agiBonus: 1,
    intBonus: 1,
  },
  [ItemsEnum['Mantle of Intelligence']]: {
    relevantValues: true,
    gold: 140,
    intBonus: 3,
  },
  [ItemsEnum['Robe of the Magi']]: {
    relevantValues: true,
    gold: 450,
    intBonus: 6,
  },
  [ItemsEnum['Slippers of Agility']]: {
    relevantValues: true,
    gold: 140,
    agiBonus: 3,
  },
  [ItemsEnum['Blades of Attack']]: {
    relevantValues: true,
    gold: 450,
    dmgRaw: 9,
  },
  [ItemsEnum['Blight Stone']]: {
    relevantValues: true,
    gold: 300,
    armorDebuff: 2,
    armorDebuffDuration: 8,
  },
  [ItemsEnum['Chainmail']]: {
    relevantValues: true,
    gold: 550,
    armorRaw: 4,
  },
  [ItemsEnum['Gloves of Haste']]: {
    relevantValues: true,
    gold: 450,
    attSpeedRaw: 20,
  },
  [ItemsEnum['Raindrops']]: {
    relevantValues: false,
    gold: 225,
    manaRegenPermanent: 0.8,
  },
  [ItemsEnum['Orb of Venom']]: {
    relevantValues: true,
    gold: 275,
    dmgTempValue: 2,
    dmgTempDuration: 2,
  },
  [ItemsEnum['Quelling Blade']]: {
    relevantValues: false,
    gold: 130,
  },
  [ItemsEnum['Ring of Protection']]: {
    relevantValues: true,
    gold: 175,
    armorRaw: 2,
  },
  [ItemsEnum['Boots of Speed']]: {
    relevantValues: false,
    gold: 500,
  },
  [ItemsEnum['Cloak']]: {
    relevantValues: false,
    gold: 500,
  },
  [ItemsEnum['Fluffy Hat']]: {
    relevantValues: true,
    gold: 250,
    hpRaw: 125,
  },
  [ItemsEnum['Magic Stick']]: {
    relevantValues: false,
    gold: 200,
  },
  [ItemsEnum['Ring of Regen']]: {
    relevantValues: true,
    gold: 175,
    hpRegenPermanent: 1.25,
  },
  [ItemsEnum["Sage's Mask"]]: {
    relevantValues: false,
    gold: 175,
    manaRegenPermanent: 0.7,
  },
  [ItemsEnum['Wind Lace']]: {
    relevantValues: false,
    gold: 250,
  },
  [ItemsEnum['Bracer']]: {
    relevantValues: true,
    gold: 505,
    strBonus: 5,
    agiBonus: 2,
    intBonus: 2,
    hpRegenPermanent: 1,
    dmgRaw: 3,
  },
  [ItemsEnum['Magic Wand']]: {
    relevantValues: true,
    gold: 450,
    strBonus: 3,
    agiBonus: 3,
    intBonus: 3,
  },
  [ItemsEnum['Null Talisman']]: {
    relevantValues: true,
    gold: 505,
    strBonus: 2,
    agiBonus: 2,
    intBonus: 5,
    manaRegenPermanent: 0.6,
  },
  [ItemsEnum['Wraith Band']]: {
    relevantValues: true,
    gold: 505,
    strBonus: 2,
    agiBonus: 5,
    intBonus: 2,
    armorRaw: 1.5,
    attSpeedRaw: 5,
  },
  [ItemsEnum['Buckler']]: {
    relevantValues: true,
    gold: 425,
    armorRaw: 3,
  },
  [ItemsEnum['Headdress']]: {
    relevantValues: true,
    gold: 425,
    hpRegenPermanent: 2.5,
  },
  [ItemsEnum['Ring of Basilius']]: {
    relevantValues: true,
    gold: 425,
    manaRegenPermanent: 1.5,
  },
  [ItemsEnum['no item']]: {
    relevantValues: false,
    gold: 0,
  },
};

export const heroStartItems: heroItemSlots = {
  [Heroes['Anti-Mage']]: {
    item1: ItemsEnum['Tango'],
    item2: ItemsEnum['Healing Salve'],
    item3: ItemsEnum['Quelling Blade'],
    item4: ItemsEnum['Iron Branch'],
    item5: ItemsEnum['Iron Branch'],
    item6: ItemsEnum['Slippers of Agility'],
  },
  [Heroes['Axe']]: {
    item1: ItemsEnum['Tango'],
    item2: ItemsEnum['Healing Salve'],
    item3: ItemsEnum['Faerie Fire'],
    item4: ItemsEnum['Iron Branch'],
    item5: ItemsEnum['Iron Branch'],
    item6: ItemsEnum['Iron Branch'],
  },
  [Heroes['Bane']]: {
    item1: ItemsEnum['Tango'],
    item2: ItemsEnum['Healing Salve'],
    item3: ItemsEnum['Clarity'],
    item4: ItemsEnum['Enchanted Mango'],
    item5: ItemsEnum['Faerie Fire'],
    item6: ItemsEnum['Iron Branch'],
  },
  [Heroes['Bloodseeker']]: {
    item1: ItemsEnum['Tango'],
    item2: ItemsEnum['Healing Salve'],
    item3: ItemsEnum['Iron Branch'],
    item4: ItemsEnum['Iron Branch'],
    item5: ItemsEnum['Quelling Blade'],
    item6: ItemsEnum['Circlet'],
  },
  [Heroes['Crystal Maiden']]: {
    item1: ItemsEnum['Tango'],
    item2: ItemsEnum['Healing Salve'],
    item3: ItemsEnum['Enchanted Mango'],
    item4: ItemsEnum['Clarity'],
    item5: ItemsEnum['Iron Branch'],
    item6: undefined,
  },
  [Heroes['Drow Ranger']]: {
    item1: ItemsEnum['Tango'],
    item2: ItemsEnum['Iron Branch'],
    item3: ItemsEnum['Iron Branch'],
    item4: ItemsEnum['Slippers of Agility'],
    item5: ItemsEnum['Slippers of Agility'],
    item6: undefined,
  },
  [Heroes['Earthshaker']]: {
    item1: ItemsEnum['Tango'],
    item2: ItemsEnum['Boots of Speed'],
    item3: ItemsEnum['Observer Ward'],
    item4: undefined,
    item5: undefined,
    item6: undefined,
  },
  [Heroes['Juggernaut']]: {
    item1: ItemsEnum['Tango'],
    item2: ItemsEnum['Slippers of Agility'],
    item3: ItemsEnum['Iron Branch'],
    item4: ItemsEnum['Iron Branch'],
    item5: ItemsEnum['Quelling Blade'],
    item6: undefined,
  },
  [Heroes['Mirana']]: {
    item1: ItemsEnum['Tango'],
    item2: ItemsEnum['Faerie Fire'],
    item3: ItemsEnum['Iron Branch'],
    item4: ItemsEnum['Iron Branch'],
    item5: ItemsEnum["Sage's Mask"],
    item6: ItemsEnum['Circlet'],
  },
  [Heroes['Morphling']]: {
    item1: ItemsEnum['Tango'],
    item2: ItemsEnum['Iron Branch'],
    item3: ItemsEnum['Iron Branch'],
    item4: ItemsEnum['Slippers of Agility'],
    item5: ItemsEnum['Circlet'],
    item6: undefined,
  },
  [Heroes['Shadow Fiend']]: {
    item1: ItemsEnum['Tango'],
    item2: ItemsEnum['Faerie Fire'],
    item3: ItemsEnum['Iron Branch'],
    item4: ItemsEnum['Iron Branch'],
    item5: ItemsEnum['Enchanted Mango'],
    item6: ItemsEnum['Observer Ward'],
  },
  [Heroes['Phantom Lancer']]: {
    item1: ItemsEnum['Tango'],
    item2: ItemsEnum['Healing Salve'],
    item3: ItemsEnum['Iron Branch'],
    item4: ItemsEnum['Iron Branch'],
    item5: ItemsEnum['Quelling Blade'],
    item6: ItemsEnum['Circlet'],
  },
  [Heroes['Puck']]: {
    item1: ItemsEnum['Tango'],
    item2: ItemsEnum['Faerie Fire'],
    item3: ItemsEnum['Iron Branch'],
    item4: ItemsEnum['Iron Branch'],
    item5: ItemsEnum['Mantle of Intelligence'],
    item6: ItemsEnum['Circlet'],
  },
  [Heroes['Pudge']]: {
    item1: ItemsEnum['Tango'],
    item2: ItemsEnum['Enchanted Mango'],
    item3: ItemsEnum['Faerie Fire'],
    item4: ItemsEnum['Ring of Protection'],
    item5: ItemsEnum['Iron Branch'],
    item6: ItemsEnum['Iron Branch'],
  },
  [Heroes['Razor']]: {
    item1: ItemsEnum['Tango'],
    item2: ItemsEnum['Iron Branch'],
    item3: ItemsEnum['Iron Branch'],
    item4: ItemsEnum['Faerie Fire'],
    item5: ItemsEnum['Slippers of Agility'],
    item6: ItemsEnum['Circlet'],
  },
  [Heroes['Sand King']]: {
    item1: ItemsEnum['Tango'],
    item2: ItemsEnum['Healing Salve'],
    item3: ItemsEnum['Enchanted Mango'],
    item4: ItemsEnum['Iron Branch'],
    item5: ItemsEnum['Iron Branch'],
    item6: ItemsEnum['Quelling Blade'],
  },
  [Heroes['Storm Spirit']]: {
    item1: ItemsEnum['Tango'],
    item2: ItemsEnum['Iron Branch'],
    item3: ItemsEnum['Iron Branch'],
    item4: ItemsEnum['Circlet'],
    item5: ItemsEnum['Observer Ward'],
    item6: undefined,
  },
  [Heroes['Sven']]: {
    item1: ItemsEnum['Tango'],
    item2: ItemsEnum['Healing Salve'],
    item3: ItemsEnum['Enchanted Mango'],
    item4: ItemsEnum['Faerie Fire'],
    item5: ItemsEnum['Quelling Blade'],
    item6: ItemsEnum['Iron Branch'],
  },
  [Heroes['Tiny']]: {
    item1: ItemsEnum['Tango'],
    item2: ItemsEnum['Iron Branch'],
    item3: ItemsEnum['Iron Branch'],
    item4: ItemsEnum['Faerie Fire'],
    item5: ItemsEnum['Quelling Blade'],
    item6: ItemsEnum['Observer Ward'],
  },
  [Heroes['Vengeful Spirit']]: {
    item1: ItemsEnum['Tango'],
    item2: ItemsEnum['Healing Salve'],
    item3: ItemsEnum['Enchanted Mango'],
    item4: ItemsEnum['Faerie Fire'],
    item5: ItemsEnum['Iron Branch'],
    item6: ItemsEnum['Iron Branch'],
  },
  [Heroes['Windranger']]: {
    item1: ItemsEnum['Tango'],
    item2: ItemsEnum['Iron Branch'],
    item3: ItemsEnum['Iron Branch'],
    item4: ItemsEnum['Faerie Fire'],
    item5: ItemsEnum['Mantle of Intelligence'],
    item6: ItemsEnum['Circlet'],
  },
  [Heroes['Zeus']]: {
    item1: ItemsEnum['Tango'],
    item2: ItemsEnum['Faerie Fire'],
    item3: ItemsEnum['Iron Branch'],
    item4: ItemsEnum['Iron Branch'],
    item5: ItemsEnum['Circlet'],
    item6: ItemsEnum['Observer Ward'],
  },
  [Heroes['Kunkka']]: {
    item1: ItemsEnum['Tango'],
    item2: ItemsEnum['Healing Salve'],
    item3: ItemsEnum['Iron Branch'],
    item4: ItemsEnum['Iron Branch'],
    item5: ItemsEnum['Quelling Blade'],
    item6: ItemsEnum['Observer Ward'],
  },
  [Heroes['Lina']]: {
    item1: ItemsEnum['Tango'],
    item2: ItemsEnum['Faerie Fire'],
    item3: ItemsEnum['Iron Branch'],
    item4: ItemsEnum['Iron Branch'],
    item5: ItemsEnum['Mantle of Intelligence'],
    item6: ItemsEnum['Circlet'],
  },
  [Heroes['Lion']]: {
    item1: ItemsEnum['Tango'],
    item2: ItemsEnum['Healing Salve'],
    item3: ItemsEnum['Clarity'],
    item4: ItemsEnum['Iron Branch'],
    item5: ItemsEnum['Iron Branch'],
    item6: ItemsEnum['Wind Lace'],
  },
  [Heroes['Shadow Shaman']]: {
    item1: ItemsEnum['Tango'],
    item2: ItemsEnum['Healing Salve'],
    item3: ItemsEnum['Clarity'],
    item4: ItemsEnum['Enchanted Mango'],
    item5: ItemsEnum['Iron Branch'],
    item6: ItemsEnum['Iron Branch'],
  },
  [Heroes['Slardar']]: {
    item1: ItemsEnum['Tango'],
    item2: ItemsEnum['Healing Salve'],
    item3: ItemsEnum['Iron Branch'],
    item4: ItemsEnum['Quelling Blade'],
    item5: ItemsEnum['Circlet'],
    item6: ItemsEnum['Observer Ward'],
  },
  [Heroes['Tidehunter']]: {
    item1: ItemsEnum['Tango'],
    item2: ItemsEnum['Healing Salve'],
    item3: ItemsEnum['Ring of Protection'],
    item4: ItemsEnum['Iron Branch'],
    item5: ItemsEnum['Quelling Blade'],
    item6: ItemsEnum['Observer Ward'],
  },
  [Heroes['Witch Doctor']]: {
    item1: ItemsEnum['Tango'],
    item2: ItemsEnum['Healing Salve'],
    item3: ItemsEnum['Clarity'],
    item4: ItemsEnum['Faerie Fire'],
    item5: ItemsEnum['Iron Branch'],
    item6: ItemsEnum['Iron Branch'],
  },
  [Heroes['Lich']]: {
    item1: ItemsEnum['Tango'],
    item2: ItemsEnum['Healing Salve'],
    item3: ItemsEnum['Enchanted Mango'],
    item4: ItemsEnum['Clarity'],
    item5: ItemsEnum['Iron Branch'],
    item6: ItemsEnum['Iron Branch'],
  },
  [Heroes['Riki']]: {
    item1: ItemsEnum['Tango'],
    item2: ItemsEnum['Iron Branch'],
    item3: ItemsEnum['Iron Branch'],
    item4: ItemsEnum['Quelling Blade'],
    item5: ItemsEnum['Orb of Venom'],
    item6: undefined,
  },
  [Heroes['Enigma']]: {
    item1: ItemsEnum['Tango'],
    item2: ItemsEnum['Null Talisman'],
    item3: ItemsEnum['Observer Ward'],
    item4: undefined,
    item5: undefined,
    item6: undefined,
  },
  [Heroes['Tinker']]: {
    item1: ItemsEnum['Tango'],
    item2: ItemsEnum['Faerie Fire'],
    item3: ItemsEnum['Iron Branch'],
    item4: ItemsEnum['Iron Branch'],
    item5: ItemsEnum['Iron Branch'],
    item6: ItemsEnum['Observer Ward'],
  },
  [Heroes['Sniper']]: {
    item1: ItemsEnum['Tango'],
    item2: ItemsEnum['Iron Branch'],
    item3: ItemsEnum['Slippers of Agility'],
    item4: ItemsEnum['Slippers of Agility'],
    item5: ItemsEnum['Circlet'],
    item6: ItemsEnum['Observer Ward'],
  },
  [Heroes['Necrophos']]: {
    item1: ItemsEnum['Tango'],
    item2: ItemsEnum['Iron Branch'],
    item3: ItemsEnum['Iron Branch'],
    item4: ItemsEnum['Faerie Fire'],
    item5: ItemsEnum['Mantle of Intelligence'],
    item6: ItemsEnum['Circlet'],
  },
  [Heroes['Warlock']]: {
    item1: ItemsEnum['Tango'],
    item2: ItemsEnum['Healing Salve'],
    item3: ItemsEnum["Sage's Mask"],
    item4: ItemsEnum['Enchanted Mango'],
    item5: ItemsEnum['Iron Branch'],
    item6: ItemsEnum['Iron Branch'],
  },
  [Heroes['Beastmaster']]: {
    item1: ItemsEnum['Tango'],
    item2: ItemsEnum['Healing Salve'],
    item3: ItemsEnum['Faerie Fire'],
    item4: ItemsEnum['Iron Branch'],
    item5: ItemsEnum['Iron Branch'],
    item6: ItemsEnum['Quelling Blade'],
  },
  [Heroes['Queen of Pain']]: {
    item1: ItemsEnum['Tango'],
    item2: ItemsEnum['Iron Branch'],
    item3: ItemsEnum['Faerie Fire'],
    item4: ItemsEnum['Mantle of Intelligence'],
    item5: ItemsEnum['Circlet'],
    item6: ItemsEnum['Observer Ward'],
  },
  [Heroes['Venomancer']]: {
    item1: ItemsEnum['Tango'],
    item2: ItemsEnum['Healing Salve'],
    item3: ItemsEnum['Faerie Fire'],
    item4: ItemsEnum['Iron Branch'],
    item5: ItemsEnum['Iron Branch'],
    item6: ItemsEnum['Circlet'],
  },
  [Heroes['Faceless Void']]: {
    item1: ItemsEnum['Tango'],
    item2: ItemsEnum['Healing Salve'],
    item3: ItemsEnum['Iron Branch'],
    item4: ItemsEnum['Iron Branch'],
    item5: ItemsEnum['Quelling Blade'],
    item6: ItemsEnum['Slippers of Agility'],
  },
  [Heroes['Wraith King']]: {
    item1: ItemsEnum['Tango'],
    item2: ItemsEnum['Healing Salve'],
    item3: ItemsEnum['Iron Branch'],
    item4: ItemsEnum['Iron Branch'],
    item5: ItemsEnum['Quelling Blade'],
    item6: undefined,
  },
  [Heroes['Death Prophet']]: {
    item1: ItemsEnum['Tango'],
    item2: ItemsEnum['Faerie Fire'],
    item3: ItemsEnum['Iron Branch'],
    item4: ItemsEnum['Iron Branch'],
    item5: ItemsEnum['Circlet'],
    item6: ItemsEnum['Mantle of Intelligence'],
  },
  [Heroes['Phantom Assassin']]: {
    item1: ItemsEnum['Tango'],
    item2: ItemsEnum['Healing Salve'],
    item3: ItemsEnum['Iron Branch'],
    item4: ItemsEnum['Iron Branch'],
    item5: ItemsEnum['Quelling Blade'],
    item6: ItemsEnum['Slippers of Agility'],
  },
  [Heroes['Pugna']]: {
    item1: ItemsEnum['Tango'],
    item2: ItemsEnum['Faerie Fire'],
    item3: ItemsEnum['Iron Branch'],
    item4: ItemsEnum['Iron Branch'],
    item5: ItemsEnum['Mantle of Intelligence'],
    item6: ItemsEnum['Circlet'],
  },
  [Heroes['Templar Assassin']]: {
    item1: ItemsEnum['Tango'],
    item2: ItemsEnum['Faerie Fire'],
    item3: ItemsEnum['Iron Branch'],
    item4: ItemsEnum['Slippers of Agility'],
    item5: ItemsEnum['Circlet'],
    item6: ItemsEnum['Observer Ward'],
  },
  [Heroes['Viper']]: {
    item1: ItemsEnum['Tango'],
    item2: ItemsEnum['Faerie Fire'],
    item3: ItemsEnum['Iron Branch'],
    item4: ItemsEnum['Iron Branch'],
    item5: ItemsEnum['Iron Branch'],
    item6: ItemsEnum['Slippers of Agility'],
  },
  [Heroes['Luna']]: {
    item1: ItemsEnum['Tango'],
    item2: ItemsEnum['Faerie Fire'],
    item3: ItemsEnum['Iron Branch'],
    item4: ItemsEnum['Iron Branch'],
    item5: ItemsEnum['Slippers of Agility'],
    item6: ItemsEnum['Quelling Blade'],
  },
  [Heroes['Dragon Knight']]: {
    item1: ItemsEnum['Tango'],
    item2: ItemsEnum['Iron Branch'],
    item3: ItemsEnum['Iron Branch'],
    item4: ItemsEnum['Faerie Fire'],
    item5: ItemsEnum['Quelling Blade'],
    item6: ItemsEnum['Ring of Protection'],
  },
  [Heroes['Dazzle']]: {
    item1: ItemsEnum['Tango'],
    item2: ItemsEnum['Healing Salve'],
    item3: ItemsEnum['Faerie Fire'],
    item4: ItemsEnum['Enchanted Mango'],
    item5: ItemsEnum["Sage's Mask"],
    item6: ItemsEnum['Observer Ward'],
  },
  [Heroes['Clockwerk']]: {
    item1: ItemsEnum['Tango'],
    item2: ItemsEnum['Healing Salve'],
    item3: ItemsEnum['Enchanted Mango'],
    item4: ItemsEnum['Wind Lace'],
    item5: ItemsEnum['Observer Ward'],
    item6: undefined,
  },
  [Heroes['Leshrac']]: {
    item1: ItemsEnum['Tango'],
    item2: ItemsEnum['Faerie Fire'],
    item3: ItemsEnum['Iron Branch'],
    item4: ItemsEnum['Iron Branch'],
    item5: ItemsEnum['Mantle of Intelligence'],
    item6: ItemsEnum['Circlet'],
  },
  [Heroes["Nature's Prophet"]]: {
    item1: ItemsEnum['Tango'],
    item2: ItemsEnum['Faerie Fire'],
    item3: ItemsEnum['Iron Branch'],
    item4: ItemsEnum['Iron Branch'],
    item5: ItemsEnum['Blight Stone'],
    item6: ItemsEnum['Observer Ward'],
  },
  [Heroes['Lifestealer']]: {
    item1: ItemsEnum['Tango'],
    item2: ItemsEnum['Iron Branch'],
    item3: ItemsEnum['Quelling Blade'],
    item4: ItemsEnum['Gauntlets of Strength'],
    item5: ItemsEnum['Circlet'],
    item6: undefined,
  },
  [Heroes['Dark Seer']]: {
    item1: ItemsEnum['Tango'],
    item2: ItemsEnum['Iron Branch'],
    item3: ItemsEnum['Iron Branch'],
    item4: ItemsEnum['Faerie Fire'],
    item5: ItemsEnum['Quelling Blade'],
    item6: ItemsEnum['Mantle of Intelligence'],
  },
  [Heroes['Clinkz']]: {
    item1: ItemsEnum['Tango'],
    item2: ItemsEnum['Tango'],
    item3: ItemsEnum['Faerie Fire'],
    item4: ItemsEnum['Iron Branch'],
    item5: ItemsEnum['Slippers of Agility'],
    item6: ItemsEnum['Circlet'],
  },
  [Heroes['Omniknight']]: {
    item1: ItemsEnum['Tango'],
    item2: ItemsEnum['Iron Branch'],
    item3: ItemsEnum['Quelling Blade'],
    item4: ItemsEnum['Gauntlets of Strength'],
    item5: ItemsEnum['Ring of Protection'],
    item6: ItemsEnum['Observer Ward'],
  },
  [Heroes['Enchantress']]: {
    item1: ItemsEnum['Tango'],
    item2: ItemsEnum['Tango'],
    item3: ItemsEnum['Iron Branch'],
    item4: ItemsEnum['Iron Branch'],
    item5: ItemsEnum['Observer Ward'],
    item6: ItemsEnum['Blight Stone'],
  },
  [Heroes['Huskar']]: {
    item1: ItemsEnum['Tango'],
    item2: ItemsEnum['Iron Branch'],
    item3: ItemsEnum['Iron Branch'],
    item4: ItemsEnum['Gauntlets of Strength'],
    item5: ItemsEnum['Circlet'],
    item6: ItemsEnum['Observer Ward'],
  },
  [Heroes['Night Stalker']]: {
    item1: ItemsEnum['Tango'],
    item2: ItemsEnum['Healing Salve'],
    item3: ItemsEnum['Iron Branch'],
    item4: ItemsEnum['Iron Branch'],
    item5: ItemsEnum['Quelling Blade'],
    item6: ItemsEnum['Circlet'],
  },
  [Heroes['Broodmother']]: {
    item1: ItemsEnum['Tango'],
    item2: ItemsEnum['Faerie Fire'],
    item3: ItemsEnum['Iron Branch'],
    item4: ItemsEnum['Iron Branch'],
    item5: ItemsEnum['Quelling Blade'],
    item6: ItemsEnum['Ring of Protection'],
  },
  [Heroes['Bounty Hunter']]: {
    item1: ItemsEnum['Tango'],
    item2: ItemsEnum['Boots of Speed'],
    item3: ItemsEnum['Observer Ward'],
    item4: undefined,
    item5: undefined,
    item6: undefined,
  },
  [Heroes['Weaver']]: {
    item1: ItemsEnum['Tango'],
    item2: ItemsEnum['Healing Salve'],
    item3: ItemsEnum['Iron Branch'],
    item4: ItemsEnum['Iron Branch'],
    item5: ItemsEnum['Slippers of Agility'],
    item6: ItemsEnum['Circlet'],
  },
  [Heroes['Jakiro']]: {
    item1: ItemsEnum['Tango'],
    item2: ItemsEnum['Healing Salve'],
    item3: ItemsEnum['Clarity'],
    item4: ItemsEnum['Enchanted Mango'],
    item5: ItemsEnum['Iron Branch'],
    item6: ItemsEnum['Iron Branch'],
  },
  [Heroes['Batrider']]: {
    item1: ItemsEnum['Tango'],
    item2: ItemsEnum['Faerie Fire'],
    item3: ItemsEnum['Iron Branch'],
    item4: ItemsEnum['Iron Branch'],
    item5: ItemsEnum['Quelling Blade'],
    item6: ItemsEnum['Observer Ward'],
  },
  [Heroes['Chen']]: {
    item1: ItemsEnum['Tango'],
    item2: ItemsEnum['Healing Salve'],
    item3: ItemsEnum['Iron Branch'],
    item4: ItemsEnum['Iron Branch'],
    item5: ItemsEnum["Sage's Mask"],
    item6: ItemsEnum['Observer Ward'],
  },
  [Heroes['Spectre']]: {
    item1: ItemsEnum['Tango'],
    item2: ItemsEnum['Faerie Fire'],
    item3: ItemsEnum['Iron Branch'],
    item4: ItemsEnum['Iron Branch'],
    item5: ItemsEnum['Quelling Blade'],
    item6: ItemsEnum['Slippers of Agility'],
  },
  [Heroes['Ancient Apparition']]: {
    item1: ItemsEnum['Tango'],
    item2: ItemsEnum['Healing Salve'],
    item3: ItemsEnum['Clarity'],
    item4: ItemsEnum['Enchanted Mango'],
    item5: ItemsEnum['Iron Branch'],
    item6: ItemsEnum['Iron Branch'],
  },
  [Heroes['Doom']]: {
    item1: ItemsEnum['Tango'],
    item2: ItemsEnum['Healing Salve'],
    item3: ItemsEnum['Iron Branch'],
    item4: ItemsEnum['Quelling Blade'],
    item5: ItemsEnum['Ring of Protection'],
    item6: ItemsEnum['Observer Ward'],
  },
  [Heroes['Ursa']]: {
    item1: ItemsEnum['Tango'],
    item2: ItemsEnum['Healing Salve'],
    item3: ItemsEnum['Faerie Fire'],
    item4: ItemsEnum['Iron Branch'],
    item5: ItemsEnum['Iron Branch'],
    item6: ItemsEnum['Quelling Blade'],
  },
  [Heroes['Spirit Breaker']]: {
    item1: ItemsEnum['Tango'],
    item2: ItemsEnum['Boots of Speed'],
    item3: ItemsEnum['Observer Ward'],
    item4: undefined,
    item5: undefined,
    item6: undefined,
  },
  [Heroes['Gyrocopter']]: {
    item1: ItemsEnum['Tango'],
    item2: ItemsEnum['Healing Salve'],
    item3: ItemsEnum['Faerie Fire'],
    item4: ItemsEnum['Iron Branch'],
    item5: ItemsEnum['Iron Branch'],
    item6: ItemsEnum["Sage's Mask"],
  },
  [Heroes['Alchemist']]: {
    item1: ItemsEnum['Tango'],
    item2: ItemsEnum['Iron Branch'],
    item3: ItemsEnum['Quelling Blade'],
    item4: ItemsEnum['Gauntlets of Strength'],
    item5: ItemsEnum['Circlet'],
    item6: ItemsEnum['Observer Ward'],
  },
  [Heroes['Invoker']]: {
    item1: ItemsEnum['Tango'],
    item2: ItemsEnum['Faerie Fire'],
    item3: ItemsEnum['Iron Branch'],
    item4: ItemsEnum['Mantle of Intelligence'],
    item5: ItemsEnum['Circlet'],
    item6: ItemsEnum['Observer Ward'],
  },
  [Heroes['Silencer']]: {
    item1: ItemsEnum['Tango'],
    item2: ItemsEnum['Healing Salve'],
    item3: ItemsEnum['Iron Branch'],
    item4: ItemsEnum['Iron Branch'],
    item5: ItemsEnum['Faerie Fire'],
    item6: ItemsEnum['Enchanted Mango'],
  },
  [Heroes['Outworld Devourer']]: {
    item1: ItemsEnum['Tango'],
    item2: ItemsEnum['Iron Branch'],
    item3: ItemsEnum['Crown'],
    item4: ItemsEnum['Observer Ward'],
    item5: undefined,
    item6: undefined,
  },
  [Heroes['Lycan']]: {
    item1: ItemsEnum['Tango'],
    item2: ItemsEnum['Faerie Fire'],
    item3: ItemsEnum['Iron Branch'],
    item4: ItemsEnum['Iron Branch'],
    item5: ItemsEnum['Quelling Blade'],
    item6: undefined,
  },
  [Heroes['Brewmaster']]: {
    item1: ItemsEnum['Tango'],
    item2: ItemsEnum['Healing Salve'],
    item3: ItemsEnum['Iron Branch'],
    item4: ItemsEnum['Quelling Blade'],
    item5: ItemsEnum['Ring of Protection'],
    item6: ItemsEnum['Observer Ward'],
  },
  [Heroes['Shadow Demon']]: {
    item1: ItemsEnum['Tango'],
    item2: ItemsEnum['Healing Salve'],
    item3: ItemsEnum['Clarity'],
    item4: ItemsEnum['Enchanted Mango'],
    item5: ItemsEnum['Iron Branch'],
    item6: ItemsEnum['Iron Branch'],
  },
  [Heroes['Lone Druid']]: {
    item1: ItemsEnum['Tango'],
    item2: ItemsEnum['Iron Branch'],
    item3: ItemsEnum['Iron Branch'],
    item4: ItemsEnum['Quelling Blade'],
    item5: ItemsEnum['Orb of Venom'],
    item6: undefined,
  },
  [Heroes['Chaos Knight']]: {
    item1: ItemsEnum['Tango'],
    item2: ItemsEnum['Healing Salve'],
    item3: ItemsEnum['Enchanted Mango'],
    item4: ItemsEnum['Iron Branch'],
    item5: ItemsEnum['Iron Branch'],
    item6: ItemsEnum['Quelling Blade'],
  },
  [Heroes['Meepo']]: {
    item1: ItemsEnum['Tango'],
    item2: ItemsEnum['Iron Branch'],
    item3: ItemsEnum['Quelling Blade'],
    item4: ItemsEnum['Slippers of Agility'],
    item5: ItemsEnum['Circlet'],
    item6: ItemsEnum['Observer Ward'],
  },
  [Heroes['Treant Protector']]: {
    item1: ItemsEnum['Tango'],
    item2: ItemsEnum['Healing Salve'],
    item3: ItemsEnum['Orb of Venom'],
    item4: ItemsEnum['Observer Ward'],
    item5: undefined,
    item6: undefined,
  },
  [Heroes['Ogre Magi']]: {
    item1: ItemsEnum['Tango'],
    item2: ItemsEnum['Healing Salve'],
    item3: ItemsEnum['Enchanted Mango'],
    item4: ItemsEnum['Iron Branch'],
    item5: ItemsEnum['Observer Ward'],
    item6: ItemsEnum['Observer Ward'],
  },
  [Heroes['Undying']]: {
    item1: ItemsEnum['Tango'],
    item2: ItemsEnum['Healing Salve'],
    item3: ItemsEnum['Clarity'],
    item4: ItemsEnum['Enchanted Mango'],
    item5: ItemsEnum['Iron Branch'],
    item6: ItemsEnum['Iron Branch'],
  },
  [Heroes['Rubick']]: {
    item1: ItemsEnum['Tango'],
    item2: ItemsEnum['Boots of Speed'],
    item3: ItemsEnum['Observer Ward'],
    item4: undefined,
    item5: undefined,
    item6: undefined,
  },
  [Heroes['Disruptor']]: {
    item1: ItemsEnum['Tango'],
    item2: ItemsEnum['Healing Salve'],
    item3: ItemsEnum['Enchanted Mango'],
    item4: ItemsEnum['Faerie Fire'],
    item5: ItemsEnum['Iron Branch'],
    item6: ItemsEnum['Iron Branch'],
  },
  [Heroes['Nyx Assassin']]: {
    item1: ItemsEnum['Tango'],
    item2: ItemsEnum['Boots of Speed'],
    item3: ItemsEnum['Observer Ward'],
    item4: undefined,
    item5: undefined,
    item6: undefined,
  },
  [Heroes['Naga Siren']]: {
    item1: ItemsEnum['Tango'],
    item2: ItemsEnum['Iron Branch'],
    item3: ItemsEnum['Iron Branch'],
    item4: ItemsEnum['Quelling Blade'],
    item5: ItemsEnum['Slippers of Agility'],
    item6: ItemsEnum['Slippers of Agility'],
  },
  [Heroes['Keeper of the Light']]: {
    item1: ItemsEnum['Tango'],
    item2: ItemsEnum['Healing Salve'],
    item3: ItemsEnum['Enchanted Mango'],
    item4: ItemsEnum['Faerie Fire'],
    item5: ItemsEnum['Iron Branch'],
    item6: ItemsEnum['Iron Branch'],
  },
  [Heroes['Wisp']]: {
    item1: ItemsEnum['Tango'],
    item2: ItemsEnum['Faerie Fire'],
    item3: ItemsEnum['Headdress'],
    item4: ItemsEnum['Observer Ward'],
    item5: undefined,
    item6: undefined,
  },
  [Heroes['Visage']]: {
    item1: ItemsEnum['Tango'],
    item2: ItemsEnum['Faerie Fire'],
    item3: ItemsEnum['Quelling Blade'],
    item4: ItemsEnum['Observer Ward'],
    item5: undefined,
    item6: undefined,
  },
  [Heroes['Slark']]: {
    item1: ItemsEnum['Tango'],
    item2: ItemsEnum['Healing Salve'],
    item3: ItemsEnum['Iron Branch'],
    item4: ItemsEnum['Iron Branch'],
    item5: ItemsEnum['Quelling Blade'],
    item6: ItemsEnum['Circlet'],
  },
  [Heroes['Medusa']]: {
    item1: ItemsEnum['Tango'],
    item2: ItemsEnum['Iron Branch'],
    item3: ItemsEnum['Iron Branch'],
    item4: ItemsEnum['Quelling Blade'],
    item5: ItemsEnum['Slippers of Agility'],
    item6: undefined,
  },
  [Heroes['Troll Warlord']]: {
    item1: ItemsEnum['Tango'],
    item2: ItemsEnum['Healing Salve'],
    item3: ItemsEnum['Iron Branch'],
    item4: ItemsEnum['Iron Branch'],
    item5: ItemsEnum['Quelling Blade'],
    item6: ItemsEnum['Circlet'],
  },
  [Heroes['Centaur Warrunner']]: {
    item1: ItemsEnum['Tango'],
    item2: ItemsEnum['Healing Salve'],
    item3: ItemsEnum['Iron Branch'],
    item4: ItemsEnum['Quelling Blade'],
    item5: ItemsEnum['Ring of Protection'],
    item6: ItemsEnum['Observer Ward'],
  },
  [Heroes['Magnus']]: {
    item1: ItemsEnum['Tango'],
    item2: ItemsEnum['Iron Branch'],
    item3: ItemsEnum['Iron Branch'],
    item4: ItemsEnum['Faerie Fire'],
    item5: ItemsEnum['Quelling Blade'],
    item6: ItemsEnum['Observer Ward'],
  },
  [Heroes['Timbersaw']]: {
    item1: ItemsEnum['Tango'],
    item2: ItemsEnum['Healing Salve'],
    item3: ItemsEnum['Iron Branch'],
    item4: ItemsEnum['Quelling Blade'],
    item5: ItemsEnum['Ring of Protection'],
    item6: ItemsEnum['Observer Ward'],
  },
  [Heroes['Bristleback']]: {
    item1: ItemsEnum['Tango'],
    item2: ItemsEnum['Faerie Fire'],
    item3: ItemsEnum['Iron Branch'],
    item4: ItemsEnum['Iron Branch'],
    item5: ItemsEnum['Iron Branch'],
    item6: ItemsEnum['Quelling Blade'],
  },
  [Heroes['Tusk']]: {
    item1: ItemsEnum['Tango'],
    item2: ItemsEnum['Boots of Speed'],
    item3: undefined,
    item4: undefined,
    item5: undefined,
    item6: undefined,
  },
  [Heroes['Skywrath Mage']]: {
    item1: ItemsEnum['Tango'],
    item2: ItemsEnum['Iron Branch'],
    item3: ItemsEnum['Iron Branch'],
    item4: ItemsEnum['Iron Branch'],
    item5: ItemsEnum['Mantle of Intelligence'],
    item6: ItemsEnum['Observer Ward'],
  },
  // last round
  [Heroes['Abaddon']]: {
    item1: ItemsEnum['Tango'],
    item2: ItemsEnum['Healing Salve'],
    item3: ItemsEnum['Iron Branch'],
    item4: ItemsEnum['Iron Branch'],
    item5: ItemsEnum["Sage's Mask"],
    item6: ItemsEnum['Observer Ward'],
  },
  [Heroes['Elder Titan']]: {
    item1: ItemsEnum['Tango'],
    item2: ItemsEnum['Healing Salve'],
    item3: ItemsEnum['Enchanted Mango'],
    item4: ItemsEnum['Iron Branch'],
    item5: ItemsEnum['Wind Lace'],
    item6: ItemsEnum['Observer Ward'],
  },
  [Heroes['Legion Commander']]: {
    item1: ItemsEnum['Tango'],
    item2: ItemsEnum['Iron Branch'],
    item3: ItemsEnum['Iron Branch'],
    item4: ItemsEnum['Quelling Blade'],
    item5: ItemsEnum['Gauntlets of Strength'],
    item6: ItemsEnum['Gauntlets of Strength'],
  },
  [Heroes['Techies']]: {
    item1: ItemsEnum['Tango'],
    item2: ItemsEnum['Healing Salve'],
    item3: ItemsEnum['Faerie Fire'],
    item4: ItemsEnum['Faerie Fire'],
    item5: ItemsEnum['Wind Lace'],
    item6: ItemsEnum['Observer Ward'],
  },
  [Heroes['Ember Spirit']]: {
    item1: ItemsEnum['Tango'],
    item2: ItemsEnum['Faerie Fire'],
    item3: ItemsEnum['Iron Branch'],
    item4: ItemsEnum['Iron Branch'],
    item5: ItemsEnum['Quelling Blade'],
    item6: ItemsEnum['Observer Ward'],
  },
  [Heroes['Earth Spirit']]: {
    item1: ItemsEnum['Tango'],
    item2: ItemsEnum['Healing Salve'],
    item3: ItemsEnum['Circlet'],
    item4: ItemsEnum['Ring of Protection'],
    item5: ItemsEnum['Observer Ward'],
    item6: undefined,
  },
  [Heroes['Underlord']]: {
    item1: ItemsEnum['Tango'],
    item2: ItemsEnum['Healing Salve'],
    item3: ItemsEnum['Iron Branch'],
    item4: ItemsEnum['Quelling Blade'],
    item5: ItemsEnum['Ring of Protection'],
    item6: ItemsEnum['Observer Ward'],
  },
  [Heroes['Terrorblade']]: {
    item1: ItemsEnum['Tango'],
    item2: ItemsEnum['Iron Branch'],
    item3: ItemsEnum['Iron Branch'],
    item4: ItemsEnum['Faerie Fire'],
    item5: ItemsEnum['Quelling Blade'],
    item6: ItemsEnum['Slippers of Agility'],
  },
  [Heroes['Phoenix']]: {
    item1: ItemsEnum['Tango'],
    item2: ItemsEnum['Iron Branch'],
    item3: ItemsEnum['Crown'],
    item4: ItemsEnum['Observer Ward'],
    item5: undefined,
    item6: undefined,
  },
  [Heroes['Oracle']]: {
    item1: ItemsEnum['Tango'],
    item2: ItemsEnum['Healing Salve'],
    item3: ItemsEnum['Clarity'],
    item4: ItemsEnum['Enchanted Mango'],
    item5: ItemsEnum['Iron Branch'],
    item6: ItemsEnum['Iron Branch'],
  },
  [Heroes['Winter Wyvern']]: {
    item1: ItemsEnum['Tango'],
    item2: ItemsEnum['Healing Salve'],
    item3: ItemsEnum['Faerie Fire'],
    item4: ItemsEnum['Enchanted Mango'],
    item5: ItemsEnum['Iron Branch'],
    item6: undefined,
  },
  [Heroes['Arc Warden']]: {
    item1: ItemsEnum['Tango'],
    item2: ItemsEnum['Iron Branch'],
    item3: ItemsEnum['Iron Branch'],
    item4: ItemsEnum['Quelling Blade'],
    item5: ItemsEnum['Slippers of Agility'],
    item6: ItemsEnum['Slippers of Agility'],
  },
  [Heroes['Monkey King']]: {
    item1: ItemsEnum['Tango'],
    item2: ItemsEnum['Iron Branch'],
    item3: ItemsEnum['Iron Branch'],
    item4: ItemsEnum['Quelling Blade'],
    item5: ItemsEnum['Orb of Venom'],
    item6: undefined,
  },
  [Heroes['Dark Willow']]: {
    item1: ItemsEnum['Tango'],
    item2: ItemsEnum['Healing Salve'],
    item3: ItemsEnum['Faerie Fire'],
    item4: ItemsEnum['Enchanted Mango'],
    item5: ItemsEnum['Iron Branch'],
    item6: ItemsEnum['Iron Branch'],
  },
  [Heroes['Pangolier']]: {
    item1: ItemsEnum['Tango'],
    item2: ItemsEnum['Healing Salve'],
    item3: ItemsEnum['Iron Branch'],
    item4: ItemsEnum['Iron Branch'],
    item5: ItemsEnum['Quelling Blade'],
    item6: ItemsEnum['Observer Ward'],
  },
  [Heroes['Grimstroke']]: {
    item1: ItemsEnum['Tango'],
    item2: ItemsEnum['Healing Salve'],
    item3: ItemsEnum['Enchanted Mango'],
    item4: ItemsEnum['Clarity'],
    item5: ItemsEnum['Iron Branch'],
    item6: ItemsEnum['Iron Branch'],
  },
  [Heroes['Hoodwink']]: {
    item1: ItemsEnum['Tango'],
    item2: ItemsEnum['Healing Salve'],
    item3: ItemsEnum['Iron Branch'],
    item4: ItemsEnum['Iron Branch'],
    item5: ItemsEnum['Blight Stone'],
    item6: ItemsEnum['Observer Ward'],
  },
  [Heroes['Void Spirit']]: {
    item1: ItemsEnum['Tango'],
    item2: ItemsEnum['Faerie Fire'],
    item3: ItemsEnum['Quelling Blade'],
    item4: ItemsEnum['Mantle of Intelligence'],
    item5: ItemsEnum['Circlet'],
    item6: ItemsEnum['Observer Ward'],
  },
  [Heroes['Snapfire']]: {
    item1: ItemsEnum['Tango'],
    item2: ItemsEnum['Healing Salve'],
    item3: ItemsEnum['Clarity'],
    item4: ItemsEnum['Iron Branch'],
    item5: ItemsEnum['Blight Stone'],
    item6: ItemsEnum['Observer Ward'],
  },
  [Heroes['Mars']]: {
    item1: ItemsEnum['Tango'],
    item2: ItemsEnum['Healing Salve'],
    item3: ItemsEnum['Faerie Fire'],
    item4: ItemsEnum['Quelling Blade'],
    item5: ItemsEnum['Circlet'],
    item6: ItemsEnum['Observer Ward'],
  },
  [Heroes['Dawnbreaker']]: {
    item1: ItemsEnum['Tango'],
    item2: ItemsEnum['Faerie Fire'],
    item3: ItemsEnum['Iron Branch'],
    item4: ItemsEnum['Iron Branch'],
    item5: ItemsEnum['Quelling Blade'],
    item6: ItemsEnum['Gauntlets of Strength'],
  },
};
