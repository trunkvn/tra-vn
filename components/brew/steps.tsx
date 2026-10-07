import Speak from "@/components/speak/Speak";

// The seven steps of the method, shared by the printed list in the Brew section and the guided "Brew along" mode.
export type BrewStep = {
  /** The bold lead-in, e.g. "Warm the pot and the cups." */
  title: React.ReactNode;
  body: React.ReactNode;
  /** What the guided mode adds to this step. */
  extra?: "amount" | "water" | "timer";
};

export const brewSteps: BrewStep[] = [
  {
    title: "Warm the pot and the cups.",
    body: "Pour boiling water over both. It keeps the water inside the pot as hot as it can be for the whole brew.",
  },
  {
    title: "Add the tea.",
    body: (
      <>
        Scoop the dry leaf into the small clay pot with a wooden spoon — the old name for the gesture is{" "}
        <span lang="vi">Ngọc diệp hồi cung</span><Speak text="Ngọc diệp hồi cung" size="sm" /> — until it fills about a third of the pot.
      </>
    ),
    extra: "amount",
  },
  {
    title: (
      <>
        First water: <span lang="vi">Cao sơn trường thủy</span><Speak text="Cao sơn trường thủy" size="sm" />.
      </>
    ),
    body: "Pour a little boiling water down from a height, then strain it off at once and throw it away. It washes the dust from the leaf and lets the dry leaf sink instead of floating.",
    extra: "water",
  },
  {
    title: (
      <>
        Second water: <span lang="vi">Hạ sơn nhập thủy</span><Speak text="Hạ sơn nhập thủy" size="sm" />.
      </>
    ),
    body: "Pour from high again, right up until the water spills over the rim. Put the lid on so the foam runs off, then pour boiling water over the lid to keep the pot at its hottest.",
    extra: "water",
  },
  {
    title: "Wait.",
    body: "The second water is the best cup of the pot. Leave it 60 to 90 seconds — some writers say up to two minutes.",
    extra: "timer",
  },
  {
    title: "Pour evenly.",
    body: (
      <>
        Set the cups rim to rim and sweep the spout round them in a circle, so every cup has the same strength. The
        classic way is to pour into the <span lang="vi">chén tống</span> first and share it among the{" "}
        <span lang="vi">chén quân</span> — slower, and less used now because the tea cools and the scent fades.
      </>
    ),
  },
  {
    title: "Offer the cup.",
    body: (
      <>
        Hold it with the middle finger under the base and the forefinger and thumb at the rim —{" "}
        <span lang="vi">Tam long giá ngọc</span><Speak text="Tam long giá ngọc" size="sm" /> — and bow a little as you hand it over.
      </>
    ),
  },
];
