"use client";

import * as F from "@/components/catalog/BadgesFamily";
import "@/components/catalog/BadgesFamily.css";
import { Suspense, type ComponentType } from "react";
import { useSearchParams } from "next/navigation";

const ITEMS: [string, string, ComponentType][] = [
  ["v01", "StatusPulseBadge", F.StatusPulseBadge],
  ["v02", "CountOdometerBadge", F.CountOdometerBadge],
  ["v03", "LiquidFillBadge", F.LiquidFillBadge],
  ["v04", "FlipTagBadge", F.FlipTagBadge],
  ["v05", "ShimmerProBadge", F.ShimmerProBadge],
  ["v06", "MagneticCountBadge", F.MagneticCountBadge],
  ["v07", "AvatarStackFan", F.AvatarStackFan],
  ["v08", "StoryRingAvatar", F.StoryRingAvatar],
  ["v09", "ShapeMorphAvatar", F.ShapeMorphAvatar],
  ["v10", "OverflowGroupAvatar", F.OverflowGroupAvatar],
  ["v11", "TiltPortraitAvatar", F.TiltPortraitAvatar],
  ["v12", "SpeakingRingAvatar", F.SpeakingRingAvatar],
  ["v13", "RemovableTagList", F.RemovableTagList],
  ["v14", "DragReorderTags", F.DragReorderTags],
  ["v15", "TagInputCombobox", F.TagInputCombobox],
  ["v16", "ChipFilterCount", F.ChipFilterCount],
  ["v17", "SlidingSegmentTags", F.SlidingSegmentTags],
  ["v18", "ExpandingHashTags", F.ExpandingHashTags],
  ["v19", "PeelCornerBadge", F.PeelCornerBadge],
  ["v20", "TearOffTicketBadge", F.TearOffTicketBadge],
  ["v21", "StarRatingBadge", F.StarRatingBadge],
  ["v22", "CountdownRingBadge", F.CountdownRingBadge],
  ["v23", "DeltaTrendBadge", F.DeltaTrendBadge],
  ["v24", "StreakFlameBadge", F.StreakFlameBadge],
  ["v25", "VerifiedSealBadge", F.VerifiedSealBadge],
  ["v26", "HoverCardAvatar", F.HoverCardAvatar],
  ["v27", "SwapUploadAvatar", F.SwapUploadAvatar],
  ["v28", "PriorityMorphTag", F.PriorityMorphTag],
  ["v29", "BellCountBadge", F.BellCountBadge],
  ["v30", "AvatarMarqueeRail", F.AvatarMarqueeRail]
];

function Lab() {
  const sp = useSearchParams();
  const only = sp.get("only")?.toLowerCase();
  const batch = Number(sp.get("batch"));
  let list = ITEMS;
  if (only) list = ITEMS.filter(([id]) => id === only);
  else if (batch >= 1 && batch <= 5) list = ITEMS.slice((batch - 1) * 6, batch * 6);
  return (
    <main className="gb gb-lab">
      <header className="gb-lab-head">
        <p>GOAT UI / BADGES, AVATARS AND TAGS</p>
        <h1>Small marks, carefully made.</h1>
        <span>{ITEMS.length} variants. Spring physics, keyboard support, reduced motion honored.</span>
      </header>
      <div className="gb-lab-grid">
        {list.map(([id, name, C]) => (
          <section key={id} id={id} className="gb-lab-cell">
            <h2><b>{id}</b> {name}</h2>
            <C />
          </section>
        ))}
      </div>
    </main>
  );
}

export default function Page() {
  return (
    <Suspense fallback={null}>
      <Lab />
    </Suspense>
  );
}
