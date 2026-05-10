import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mangacha MVP Plan | KAI",
  description:
    "Reference plan for building Mangacha as a canon-grounded interactive fiction MVP using AGE and Kaiju Crisis runtime principles.",
};

const storyPackage = `{
  "storyId": "saiyuki_wukong_beta",
  "title": "Journey to the West: Monkey King",
  "worldBible": {},
  "rulebook": {},
  "characters": [],
  "goals": [],
  "locations": [],
  "npcs": [],
  "items": [],
  "stateSchema": {},
  "patchContract": {},
  "canonCorpusId": "xiyouji_zh",
  "assetManifest": {}
}`;

const coreArchitecture = `Creator Webapp
-> World Bible
-> Rulebook
-> Characters
-> Goals
-> Locations / NPCs / Items
-> Asset Manifest
-> Canon Corpus / RAG
-> Story Package

Player PWA
-> Pick story
-> Pick character
-> Accept/edit goal
-> Submit action
-> Judge interprets intent
-> Kernel validates
-> Events commit
-> Projector updates state
-> Truth Packet
-> Text / image / sound / UI update`;

const verticalSlice = `Story: Journey to the West
Playable character: Wukong
Goal: become immortal / become Monkey King / defy Heaven
Locations: Flower-Fruit Mountain, Water Curtain Cave, Subodhi path
NPCs: monkey troop, Subodhi
Actions: move, talk, search, train, fight, boast, inspect`;

const playerLoop = [
  "Pick story.",
  "Pick character.",
  "Choose or edit goal.",
  "Start at a location.",
  "See current scene, NPCs, inventory, and goal progress.",
  "Type or click an action.",
  "Runtime resolves challenge.",
  "Story updates.",
  "Goal progresses, branches, fails, or changes.",
];

const creatorSteps = [
  "World Bible: name, genre, tone, canon rules, forbidden breaks.",
  "Characters: playable characters, abilities, voice, constraints, relationships.",
  "Goals: default goals, editable goal templates, win and fail conditions.",
  "Locations: world map, location map, connected areas, NPC presence.",
  "Rules: legal actions such as talk, move, fight, search, train, steal, negotiate, wait.",
  "Challenges: obstacles tied to goal progress.",
  "Assets: portraits, backgrounds, music cues, sound effects, animation hints.",
  "Publish Check: missing rules, impossible goals, undefined NPCs, unsafe patch paths.",
];

const playerPanels = [
  "Story Update: main immersive text, image, sound, animation.",
  "Goal Tracker: current goal, progress, blockers, next known step.",
  "Input Panel: free text plus action buttons.",
  "Location Panel: current place, exits, nearby NPCs/items.",
  "NPC Panel: click NPCs to talk, attack, threaten, help, or inspect.",
  "Character Sheet: abilities, titles, relationships, inventory.",
  "Event Log: replayable history.",
];

const buildOrder = [
  "Define StoryPackage schema.",
  "Convert current wukong.json into a package.",
  "Replace full-state LLM update with JudgeRuling patch ops.",
  "Add kernel patch contract.",
  "Add event-store save/load.",
  "Build player PWA around truth packets.",
  "Add Creator Studio for editing the same package fields.",
  "Add asset manifest and generated scene images.",
  "Add playtest telemetry.",
  "Only then add more stories and characters.",
];

function CodeBlock({ children }: { children: string }) {
  return (
    <pre className="overflow-x-auto rounded-lg border border-edge bg-surface p-4 text-xs leading-relaxed text-ink md:text-sm">
      <code>{children}</code>
    </pre>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-t border-edge py-10">
      <h2 className="mb-5 text-2xl font-bold tracking-tight md:text-3xl">
        {title}
      </h2>
      {children}
    </section>
  );
}

function NumberedList({ items }: { items: string[] }) {
  return (
    <ol className="space-y-3 pl-5 text-sm leading-relaxed text-ink-muted md:text-base">
      {items.map((item) => (
        <li key={item} className="list-decimal">
          {item}
        </li>
      ))}
    </ol>
  );
}

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="space-y-3 pl-5 text-sm leading-relaxed text-ink-muted md:text-base">
      {items.map((item) => (
        <li key={item} className="list-disc">
          {item}
        </li>
      ))}
    </ul>
  );
}

export default function IsekaiPlanPage() {
  return (
    <article className="mx-auto max-w-5xl px-6 py-16 md:py-24">
      <header className="pb-10">
        <p className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-primary">
          Future Reference
        </p>
        <h1 className="max-w-4xl text-4xl font-bold leading-tight tracking-tight md:text-6xl">
          Mangacha MVP Plan
        </h1>
        <p className="mt-6 max-w-3xl text-base leading-relaxed text-ink-muted md:text-lg">
          A mixed approach: Mangacha content model plus Kaiju Crisis and AGE
          runtime discipline. The goal is a working beta where players pick a
          story and character, pursue a goal, overcome challenges, and reach a
          meaningful ending.
        </p>
      </header>

      <Section title="Product Shape">
        <div className="grid gap-5 md:grid-cols-3">
          {[
            [
              "Players",
              "Pick a story, pick a character, accept or edit a goal, overcome challenges, and achieve or fail the goal.",
            ],
            [
              "Creators",
              "Input a world bible and rules. The system outputs a playable story package.",
            ],
            [
              "Interfaces",
              "Creator webapp plus player PWA with goal tracking, immersive story updates, input panel, maps, stats, inventory, and NPC interactions.",
            ],
          ].map(([title, body]) => (
            <div key={title} className="rounded-lg bg-surface-card p-6 shadow-sm">
              <h3 className="mb-2 text-lg font-bold">{title}</h3>
              <p className="text-sm leading-relaxed text-ink-muted">{body}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Core Architecture">
        <CodeBlock>{coreArchitecture}</CodeBlock>
        <div className="mt-5 rounded-lg border-l-4 border-primary bg-badge-bg p-5 text-sm leading-relaxed text-ink">
          <strong>Critical rule:</strong> Creator authors possibility space.
          Player acts inside it. LLM interprets and narrates. Kernel protects
          reality. UI makes reality playable.
        </div>
      </Section>

      <Section title="What To Borrow">
        <div className="grid gap-5 md:grid-cols-2">
          <div className="rounded-lg bg-surface-card p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-bold text-primary">From Kaiju Crisis</h3>
            <Bullets
              items={[
                "No state change without validated event.",
                "Event store and deterministic projector.",
                "Kernel and patch contract.",
                "Truth packet for UI and narration.",
                "Suggestions, action affordances, debug inspector.",
                "Panels for map, stats, inventory, objectives, NPCs.",
              ]}
            />
          </div>
          <div className="rounded-lg bg-surface-card p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-bold text-primary">From Mangacha</h3>
            <Bullets
              items={[
                "Canon story grounding.",
                "Character POV and character voice.",
                "Story/chapter progression.",
                "RAG over source material.",
                "OOC and canon constraints.",
                "Memory and divergence tracking.",
              ]}
            />
          </div>
        </div>
      </Section>

      <Section title="Story Package">
        <p className="mb-4 text-sm leading-relaxed text-ink-muted md:text-base">
          This is the product boundary. Creator input becomes a package; player
          sessions run against a package.
        </p>
        <CodeBlock>{storyPackage}</CodeBlock>
      </Section>

      <Section title="Player Loop">
        <NumberedList items={playerLoop} />
        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <CodeBlock>
            {"Talk to Subodhi and ask for immortality training."}
          </CodeBlock>
          <CodeBlock>
            {`{
  "actionType": "talk",
  "actor": "wukong",
  "targets": ["subodhi"],
  "goal": "seek_immortality_training",
  "method": "direct_request"
}`}
          </CodeBlock>
        </div>
      </Section>

      <Section title="Creator Webapp MVP">
        <NumberedList items={creatorSteps} />
      </Section>

      <Section title="Player PWA MVP">
        <Bullets items={playerPanels} />
      </Section>

      <Section title="MVP Constraint">
        <p className="mb-4 text-sm leading-relaxed text-ink-muted md:text-base">
          Do not build full creator freedom first. Build one strong vertical.
        </p>
        <CodeBlock>{verticalSlice}</CodeBlock>
      </Section>

      <Section title="Build Order">
        <NumberedList items={buildOrder} />
      </Section>
    </article>
  );
}
