"use client";
import { useEffect, useState } from "react";
import { readBallot } from "@/lib/voters-guide/race-sheet/ballot-store";
import BottomBar from "./BottomBar";

/**
 * The phone bar on a race's votes page. It is the same bar as the race sheet,
 * with Votes as the current item; the saved count comes from this tab's
 * storage so the My ballot item reads the same on both pages.
 */
export default function VotesBar({ raceId, candidateIds }: { raceId: string; candidateIds: string[] }) {
  const [savedCount, setSavedCount] = useState(0);
  const ids = candidateIds.join(",");
  useEffect(() => {
    setSavedCount(readBallot(raceId, ids.split(",")).state.order.length);
  }, [raceId, ids]);
  return <BottomBar raceId={raceId} savedCount={savedCount} current="votes" />;
}
