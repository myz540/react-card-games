export const _CARD_MAP = Object.freeze({
  // ACE
  SPADE_A: "🂡",
  CLUB_A: "🃑",
  HEART_A: "🂱",
  DIAMOND_A: "🃁",
  // TWO
  SPADE_2: "🂢",
  CLUB_2: "🃒",
  HEART_2: "🂲",
  DIAMOND_2: "🃂",
  // THREE
  SPADE_3: "🂣",
  CLUB_3: "🃓",
  HEART_3: "🂳",
  DIAMOND_3: "🃃",
  // FOUR
  SPADE_4: "🂤",
  CLUB_4: "🃔",
  HEART_4: "🂴",
  DIAMOND_4: "🃄",
  // FIVE
  SPADE_5: "🂥",
  CLUB_5: "🃕",
  HEART_5: "🂵",
  DIAMOND_5: "🃅",
  // SIX
  SPADE_6: "🂦",
  CLUB_6: "🃖",
  HEART_6: "🂶",
  DIAMOND_6: "🃆",
  // SEVEN
  SPADE_7: "🂧",
  CLUB_7: "🃗",
  HEART_7: "🂷",
  DIAMOND_7: "🃇",
  // EIGHT
  SPADE_8: "🂨",
  CLUB_8: "🃘",
  HEART_8: "🂸",
  DIAMOND_8: "🃈",
  // NINE
  SPADE_9: "🂩",
  CLUB_9: "🃙",
  HEART_9: "🂹",
  DIAMOND_9: "🃉",
  // TEN
  SPADE_10: "🂪",
  CLUB_10: "🃚",
  HEART_10: "🂺",
  DIAMOND_10: "🃊",
  // JACK
  SPADE_11: "🂫",
  CLUB_11: "🃛",
  HEART_11: "🂻",
  DIAMOND_11: "🃋",
  // QUEEN
  SPADE_12: "🂭",
  CLUB_12: "🃝",
  HEART_12: "🂽",
  DIAMOND_12: "🃍",
  // KING
  SPADE_13: "🂮",
  CLUB_13: "🃞",
  HEART_13: "🂾",
  DIAMOND_13: "🃎",
});

export const CARD_BACK = {
  name: "CARD_BACK",
  icon: "🂠",
  suit: "SPADE",
  value: null,
};

export const CARD_MAP = Object.entries(_CARD_MAP).map((card) => ({
  name: card[0],
  icon: card[1],
  suit: card[0].split("_")[0],
  value: card[0].split("_")[1],
}));

export function shuffle(array) {
  const newArray = array.slice();
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = newArray[i];
    newArray[i] = newArray[j];
    newArray[j] = temp;
  }
  return newArray;
}
