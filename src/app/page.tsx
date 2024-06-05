"use client";

import GameMenuPage from "@/templates/GameMenuPage";
import { TicTacToePage } from "@/templates/TicTacToePage";
import { useState } from "react";

export default function Home() {
  const [difficulty, setDifficulty] = useState<number>(0);
  const [backToMenu, setBackToMenu] = useState<boolean>(false);

  // Handle going back to the menu
  const handleGoBackToMenu = () => {
    setBackToMenu(true);
    setDifficulty(0); 
  };

  return (
    <>
      {backToMenu || difficulty === 0 ? (
        <GameMenuPage difficulty={difficulty} setDifficulty={(diff) => {
          setDifficulty(diff);
          setBackToMenu(false);
        }} />
      ) : (
        <TicTacToePage difficulty={difficulty} handleGoBackToMenu={handleGoBackToMenu} />
      )}
    </>
  );
}
