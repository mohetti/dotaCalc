export interface heroItemSlots {
  [key: string]: StartItems;
}

interface StartItems {
  item1: number | null;
  item2: number | null;
  item3: number | null;
  item4: number | null;
  item5: number | null;
  item6: number | null;
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
