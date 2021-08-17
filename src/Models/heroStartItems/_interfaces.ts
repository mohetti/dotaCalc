export interface heroItemSlots {
  [key: string]: StartItems;
}

export interface StartItems {
  item1: number | undefined;
  item2: number | undefined;
  item3: number | undefined;
  item4: number | undefined;
  item5: number | undefined;
  item6: number | undefined;
}

export interface ItemListStatic {
  [key: string]: {
    relevantValues: boolean;
    gold: number;
    strBonus?: number;
    agiBonus?: number;
    intBonus?: number;
    hpRaw?: number;
    hpRegenPermanent?: number;
    hpRegenTemp?: number;
    hpRegenDuration?: number;
    manaRaw?: number;
    manaRegenPermanent?: number;
    manaRegenTemp?: number;
    manaRegenDuration?: number;
    armorRaw?: number;
    dmgRaw?: number;
    dmgTempValue?: number;
    dmgTempDuration?: number;
    attSpeedRaw?: number;
    armorDebuff?: number;
    armorDebuffDuration?: number;
    attSpeedDebuff?: number;
    attSpeedDebuffDuration?: number;
    magiceDmgTempValue?: number;
    magicDmgTempDuration?: number;
  };
}
