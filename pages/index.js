//* ████████╗██╗░░██╗███████╗  ░██╗░░░░░░░██╗░█████╗░██████╗░██████╗░
//* ╚══██╔══╝██║░░██║██╔════╝  ░██║░░██╗░░██║██╔══██╗██╔══██╗██╔══██╗
//* ░░░██║░░░███████║█████╗░░  ░╚██╗████╗██╔╝██║░░██║██████╔╝██║░░██║
//* ░░░██║░░░██╔══██║██╔══╝░░  ░░████╔═████║░██║░░██║██╔══██╗██║░░██║
//* ░░░██║░░░██║░░██║███████╗  ░░╚██╔╝░╚██╔╝░╚█████╔╝██║░░██║██████╔╝
//* ░░░╚═╝░░░╚═╝░░╚═╝╚══════╝  ░░░╚═╝░░░╚═╝░░░╚════╝░╚═╝░░╚═╝╚═════╝░
//* https://fsymbols.com/generators/carty/

// "use client";

import { useState, useEffect, useContext } from "react";
import Script from "next/script";
import dynamic from "next/dynamic";
import Head from "next/head";
import GuessList from "@components/GuessList";
import Input from "@components/Input";
import GuessCell from "@components/GuessCell";
import { GameAPI } from "api/GameAPI";
import { RESPONSE_MESSAGE } from "constansts";
import pluralize from "pluralize";

import GuessNotificationContext from "@components/GuessNotification/guessNotificationManager";
import { HowToPlay } from "@components/HowToPlay";
import { PlayWithFriendsModal } from "@components/PlayWithFriendsModal";

const ClosestWordList = dynamic(() => import("@components/ClosestWordList"));
const GuessNotification = dynamic(() => import("@components/GuessNotification"));
const LevelSelectorButton = dynamic(() => import("@components/LevelSelectorButton"));
const LevelSelectorModal = dynamic(() => import("@components/LevelSelectorModal"));
const CompletedLevelmodal = dynamic(() => import("@components/CompletedLevelModal"));

const Main = ({ levels }) => {
  const [gameState, setGameState] = useState({ completedGames: [], games: {} });
  const [level, setLevel] = useState("1");
  const [randomLevelToken, setRandomLevelToken] = useState(null);
  const [closestWords, setClosestWords] = useState([]);

  const [showLevelSelector, setShowLevelSelector] = useState(false);
  const [showLevelCompleted, setShowLevelCompleted] = useState(false);
  const [showClosestWords, setShowClosestWords] = useState(false);
  const [showPWF, setShowPWF] = useState(false);

  const [isClosestWordsLoading, setIsClosestWordsLoading] = useState(false);

  const guessNotificationContext = useContext(GuessNotificationContext);

  useEffect(() => {
    console.log("████████╗██╗░░██╗███████╗  ░██╗░░░░░░░██╗░█████╗░██████╗░██████╗░");
    console.log("╚══██╔══╝██║░░██║██╔════╝  ░██║░░██╗░░██║██╔══██╗██╔══██╗██╔══██╗");
    console.log("░░░██║░░░███████║█████╗░░  ░╚██╗████╗██╔╝██║░░██║██████╔╝██║░░██║");
    console.log("░░░██║░░░██╔══██║██╔══╝░░  ░░████╔═████║░██║░░██║██╔══██╗██║░░██║");
    console.log("░░░██║░░░██║░░██║███████╗  ░░╚██╔╝░╚██╔╝░╚█████╔╝██║░░██║██████╔╝");
    console.log("░░░╚═╝░░░╚═╝░░╚═╝╚══════╝  ░░░╚═╝░░░╚═╝░░░╚════╝░╚═╝░░╚═╝╚═════╝░");

    // Initialize state from localStorage
    let storedGameState = JSON.parse(window.localStorage.getItem("gameState"));

    if (level === "?") {
      storedGameState.games["?"] = { guesses: [] };
    }

    if (storedGameState != null) {
      setGameState(storedGameState);
      const { completedGames, mostRecentLevel } = storedGameState;

      const incompleteLevels = levels.filter((num) => !completedGames.includes(num));

      const highestIncompleteLevel =
        incompleteLevels.length > 0 ? Math.max(...incompleteLevels).toString() : Math.max(...levels).toString();

      setLevel(
        completedGames.includes(mostRecentLevel) || mostRecentLevel == undefined
          ? highestIncompleteLevel
          : mostRecentLevel
      );
    } else {
      setLevel(Math.max(...levels).toString());
      console.log("B");
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem("gameState", JSON.stringify(gameState));
  }, [gameState]);

  useEffect(() => {
    if (gameState.completedGames.includes(level)) {
      setShowLevelCompleted(true);
    } else {
      setShowLevelCompleted(false);
    }
  }, [level]);

  const updateGameStateGuesses = (guess) => {
    setGameState(() => {
      const { word, pos } = guess;
      const prevGuess = gameState.games[level]?.lastGuess;

      const prevColdStreak = gameState.games[level]?.currentColdStreak;
      const prevHotStreak = gameState.games[level]?.currentHotStreak;

      return {
        ...gameState,
        completedGames: [...(gameState.completedGames || []), ...(pos == 0 && level != "?" ? [level] : [])],
        games: {
          ...gameState.games,
          [level]: {
            lastGuess: { ...guess, guesseId: null },
            currentColdStreak: pos > prevGuess?.pos ? prevColdStreak + 1 : 0,
            currentHotStreak: pos < prevGuess?.pos ? prevHotStreak + 1 : 0,
            longestColdStreak: Math.max(prevColdStreak, gameState.games[level]?.longestColdStreak) || 0,
            longestHotStreak: Math.max(prevHotStreak, gameState.games[level]?.longestHotStreak) || 0,
            guesses: [...(gameState.games[level] != undefined ? gameState.games[level]?.guesses : []), guess],
            correctWord: pos == 0 ? word : gameState.games[level]?.correctWord,
            // if already complete, use complete, otherwise if pos == 0 set complete, otherwise null
            completedGameState: gameState.games[level]?.completedGameState
              ? gameState.games[level].completedGameState
              : pos == 0
              ? { ...gameState.games[level] }
              : null,
          },
        },
      };
    });

    if (guess.pos == 0) {
      // TODO need to submit # of guesses to a DB to track level difficulty (1-3)
      setShowLevelCompleted(true);
    }
  };

  const handleInputSubmit = async (word) => {
    guessNotificationContext.clear();

    // check if word already guessed
    const singularizedWord = pluralize.singular(word);
    const previouslyGuessed = gameState.games[level]?.guesses.map(({ word }) => word).includes(singularizedWord);

    if (previouslyGuessed) {
      guessNotificationContext.error(`${singularizedWord} has already been guessed`);
    } else {
      try {
        let res;
        if (randomLevelToken) {
          res = await GameAPI.getWordPosForMysteryDate(word, randomLevelToken);
        } else {
          res = await GameAPI.getWordPosForGame(word, level);
        }
        updateGameStateGuesses(res);
      } catch ({ reason, word }) {
        // * We cannot handle the error in the gameAPI because the notification context is only available in this file.
        // * Perhaps there is a way to create the game api as a react component? Unlikely
        switch (reason) {
          case RESPONSE_MESSAGE.incorrectGuess:
            guessNotificationContext.error(`I'm sorry, I don't know this word`);
            break;
          default:
            guessNotificationContext.error(`Error occurred`);
        }
      }
    }
  };

  const toggleLevelSelectorModal = () => {
    if (showLevelCompleted) setShowLevelCompleted(false);
    setShowLevelSelector(!showLevelSelector);
  };

  const closeLevelCompletedModal = () => {
    if (showLevelSelector) setShowLevelSelector(false);
    setShowLevelCompleted(false);
  };

  const closeClosestWordsModal = () => {
    setShowClosestWords(false);
  };

  const closePWFModal = () => {
    setShowPWF(false);
  };

  const handleLevelClick = async (clickedLevel) => {
    if (clickedLevel === "?") {
      const token = await GameAPI.getMysteryToken();
      setRandomLevelToken(token);
      setGameState({
        ...gameState,
        games: { ...gameState.games, ["?"]: { guesses: [] } },
      });
    } else if (clickedLevel == level && gameState.completedGames.includes(level)) {
      setShowLevelCompleted(true);
    } else {
      setGameState({ ...gameState, mostRecentLevel: clickedLevel });
    }

    setLevel(clickedLevel);
    guessNotificationContext.clear();
    toggleLevelSelectorModal();
  };

  const handleNextLevelClick = () => {
    const { completedGames } = gameState;

    const incompleteLevels = levels.filter((num) => !completedGames.includes(num));
    const highestIncompleteLevel =
      incompleteLevels.length > 0 ? Math.max(...incompleteLevels).toString() : Math.max(...levels).toString();

    setShowLevelCompleted(false);
    setLevel(incompleteLevels.length >= 1 ? highestIncompleteLevel : level);
  };

  const handleSeeClosestWordsClick = async () => {
    setShowClosestWords(true);
    setShowLevelCompleted(false);
    setIsClosestWordsLoading(true);
    const words = await GameAPI.getTop100ForLevel(level);
    setIsClosestWordsLoading(false);
    setClosestWords(words);
  };

  const getCompletedLevelStats = () => {
    const { longestColdStreak, currentColdStreak, longestHotStreak, currentHotStreak, guesses } =
      gameState.games[level]?.completedGameState;
    const stats = {
      guesses: guesses.length + 1,
      green: guesses.filter((g) => g.pos < 200).length + 1,
      yellow: guesses.filter((g) => g.pos >= 200 && g.pos < 3000).length,
      red: guesses.filter((g) => g.pos >= 3000).length,
      longestColdStreak: Math.max(currentColdStreak, longestColdStreak),
      longestHotStreak: Math.max(currentHotStreak, longestHotStreak),
      percentile: "Coming Soon",
    };
    return stats;
  };

  const modalLevels = levels.map((level) => ({
    level,
    isComplete: gameState.completedGames.includes(level),
  }));

  return (
    <div className="container">
      <Head>
        <title className="title">{`THE WORD - ${level}`}</title>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5566603516601048"
          crossOrigin="anonymous"
        />
      </Head>

      <main>
        {showPWF && <PlayWithFriendsModal handleClose={closePWFModal} />}

        {showLevelCompleted && (
          <CompletedLevelmodal
            level={level}
            handleClose={closeLevelCompletedModal}
            handleNextClick={handleNextLevelClick}
            correctWord={gameState.games[level]?.correctWord}
            handleSeeClosestWordsClick={handleSeeClosestWordsClick}
            stats={getCompletedLevelStats()}
          />
        )}

        {showClosestWords && (
          <ClosestWordList
            words={closestWords}
            isLoading={isClosestWordsLoading}
            handleClose={closeClosestWordsModal}
            guesses={gameState.games[level].guesses.map(({ word }) => word)}
          />
        )}

        <div className="header">
          <h1 className="title">{"THE WORD"}</h1>
          <LevelSelectorButton
            level={level}
            handleClick={toggleLevelSelectorModal}
            isHighlighted={showLevelSelector}
            isComplete={gameState.completedGames.includes(level)}
          />
        </div>

        {showLevelSelector && (
          <LevelSelectorModal
            levels={modalLevels}
            handleLevelClick={handleLevelClick}
            handleClose={toggleLevelSelectorModal}
          />
        )}

        <div className="playWithFriends_button" onClick={() => setShowPWF(true)}>
          PLAY WITH FRIENDS
        </div>

        <Input handleSubmit={handleInputSubmit} />

        {guessNotificationContext.notificationState === "ERROR" ? (
          <GuessNotification />
        ) : (
          gameState.games[level]?.lastGuess && (
            <GuessCell guess={gameState.games[level]?.lastGuess} isHighlighted={true} />
          )
        )}

        {gameState.games[level]?.guesses.length == null && <HowToPlay />}

        {gameState.games[level]?.guesses.length && (
          <GuessList
            guesses={gameState.games[level]?.guesses || []}
            highlightedWords={[gameState.games[level]?.lastGuess?.word]}
          />
        )}
      </main>
    </div>
  );
};

export default Main;

// ssp > sp because we want new levels when page is hit and not on build
export async function getServerSideProps() {
  const { gameNumbers: levels } = await GameAPI.getGames();
  return {
    props: { levels: [levels].pop() },
  };
}
