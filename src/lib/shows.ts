import breakfast from "@/assets/show-breakfast.jpg";
import daily from "@/assets/show-daily.jpg";
import drive from "@/assets/show-drive.jpg";
import party from "@/assets/show-party.jpg";
import top30 from "@/assets/show-top30.jpg";

export type Show = {
  slug: string;
  name: string;
  time: string;
  tagline: string;
  format: string;
  segments: string[];
  legacy: string;
  image: string;
};

export const SHOWS: Show[] = [
  {
    slug: "mike-e-emma",
    name: "Mike E & Emma's Breakfast",
    time: "Weekdays 6–9am",
    tagline: "The cheeky duo that woke up Sydney.",
    format:
      "A high-energy two-hander breakfast show built around banter, prank calls and listener confessions, glued together with the biggest pop and dance hits of the moment. Mike E and Emma traded sharp one-liners across three hours, with sponsor reads woven into bits rather than dropped between songs.",
    segments: [
      "Confession Booth — listeners ringing in with their worst-kept secrets",
      "Loose Lips — celebrity gossip recap",
      "Win It Minute — rapid-fire trivia for tickets and travel",
      "Track of the Day — one new pop release spun on the hour",
    ],
    legacy:
      "For nearly a decade Mike E & Emma defined the school-run soundtrack for Sydney's west and inner-city — quoted in playgrounds, recapped at the office water cooler.",
    image: breakfast,
  },
  {
    slug: "the-daily",
    name: "The Daily",
    time: "Weekdays 9am–12pm",
    tagline: "Pop hits to power you through the morning.",
    format:
      "A music-forward mid-morning shift: long sweeps of back-to-back chart pop with light, friendly chat between songs. Built for the desks, the cafés and anyone with a pram in one hand.",
    segments: [
      "Three In A Row — uninterrupted blocks of current hits",
      "Throwback at Ten — one guaranteed nostalgia spin",
      "The Lunch Countdown — the five most-requested songs of the morning",
    ],
    legacy:
      "The Daily was The Edge's quiet workhorse — never the loudest show, but the one that made 96.1 the default station in office radios across the CBD.",
    image: daily,
  },
  {
    slug: "drive",
    name: "Drive with The Edge",
    time: "Weekdays 4–7pm",
    tagline: "Soundtrack the long crawl home.",
    format:
      "A solo-host drive show pitched directly at commuters: traffic, weather, news on the quarter, and a heavily front-loaded music sweep so the M4 didn't feel quite so brutal. Live crosses to listeners stuck in jams became a signature.",
    segments: [
      "Stuck In Traffic — caller of the day, live from their dashboard",
      "Tomorrow Today — first-play of a song breaking that week",
      "The Wind-Down — final 30 minutes of mellower pop-R&B",
    ],
    legacy:
      "If you were on the M4, the M5 or the Hills district between 4 and 7, The Edge's drive show was the unofficial fourth lane.",
    image: drive,
  },
  {
    slug: "friday-night-party-mix",
    name: "Friday Night Party Mix",
    time: "Fri 7–10pm",
    tagline: "Pre-drinks officially started here.",
    format:
      "Three hours of beat-matched dance and pop remixes, mixed live by a rotating roster of Sydney club DJs. No talk breaks once the mix dropped — pure runway from the kitchen to the cab.",
    segments: [
      "The Warm-Up — first hour of festival-ready edits",
      "Guest Mix — 30 minutes from a local club resident",
      "Last Call — the final hour pushed to peak-time BPM",
    ],
    legacy:
      "For a generation of Sydneysiders, the Friday Night Party Mix WAS the pre-game. Bluetooth speaker on the bathroom counter, hairdryer in one hand.",
    image: party,
  },
  {
    slug: "top-30",
    name: "The Edge Top 30",
    time: "Sat 9am–12pm",
    tagline: "The 30 biggest songs in the country.",
    format:
      "A classic countdown format: 30 songs, three hours, ranked by airplay and listener votes from the week prior. Short artist bios, chart movement callouts, and a #1 reveal stretched out for maximum drama.",
    segments: [
      "The Climbers — biggest jumps inside the chart",
      "Just Missed Out — songs that fell out of the 30",
      "The Number One — full-song play with no talk over",
    ],
    legacy:
      "The Saturday morning Top 30 was appointment listening — recorded onto phones, screenshotted for socials, argued about all weekend.",
    image: top30,
  },
];

export const getShow = (slug: string) => SHOWS.find((s) => s.slug === slug);
