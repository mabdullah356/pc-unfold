export type PartCopy = {
  id: string;
  name: string;
  blurb: string;
  points: [string, string, string];
};

export const PART_COPY: Record<string, PartCopy> = {
  screen: {
    id: "screen",
    name: "Screen",
    blurb: "Your window into everything the PC does.",
    points: [
      "Resolution and panel type (IPS, OLED) define clarity and color",
      "Refresh rate up to 240 Hz makes motion look fluid",
      "Receives its image from the graphics card via HDMI or DisplayPort",
    ],
  },
  tower: {
    id: "tower",
    name: "PC Tower",
    blurb: "The house where all the computing happens.",
    points: [
      "Holds the CPU, GPU, RAM, storage and power supply",
      "Case airflow and fans decide thermals and noise levels",
      "The power LED on the front means it is alive",
    ],
  },
  keyboard: {
    id: "keyboard",
    name: "Keyboard",
    blurb: "Your primary input — letters, shortcuts, macros.",
    points: [
      "Mechanical vs membrane switches change feel and sound",
      "N-key rollover registers every simultaneous press",
      "Layouts range from compact 60% to full-size with numpad",
    ],
  },
  mouse: {
    id: "mouse",
    name: "Mouse",
    blurb: "Point, click, scroll — the fastest way to interact.",
    points: [
      "Sensor DPI controls cursor speed and precision",
      "Polling rate up to 8000 Hz shrinks input latency",
      "Ergonomic shape matters for long sessions",
    ],
  },
};
