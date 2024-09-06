// "use client";

import { useState, useEffect } from "react";
import Script from "next/script";
import dynamic from "next/dynamic";
import Head from "next/head";
import pluralize from "pluralize";
import { useRouter } from "next/router";

import GuessList from "@components/GuessList";
import Input from "@components/Input";
import GuessCell from "@components/GuessCell";
import { GameAPI } from "api/GameAPI";
import { RESPONSE_MESSAGE } from "constansts";

import { HowToPlay } from "@components/HowToPlay";
import { PlayWithFriendsModal } from "@components/PlayWithFriendsModal";

import { useSocket } from "@components/Socket/SocketContext";
import { useGuessNotificationContext } from "@components/GuessNotification/guessNotificationManager";
import LobbyModal from "@components/LobbyModal";

const ClosestWordList = dynamic(() => import("@components/ClosestWordList"));
const GuessNotification = dynamic(() => import("@components/GuessNotification"));
const LevelSelectorButton = dynamic(() => import("@components/LevelSelectorButton"));
const LevelSelectorModal = dynamic(() => import("@components/LevelSelectorModal"));
const CompletedLevelmodal = dynamic(() => import("@components/CompletedLevelModal"));

const Main = () => {
  const {
    lobbyInfo: {
      isHost,
      levels = [],
      players = [],
      gameState: { currentLevel, completedGames, games } = {},
      lobbyid,
    } = {},
    isConnected,
    disconnect,
    handleGuess,
    startSocket,
    socket,
    handleChangeLevel,
  } = useSocket();

  const router = useRouter();

  const [randomLevelToken, setRandomLevelToken] = useState(null);
  const [closestWords, setClosestWords] = useState([]);

  const [showLevelSelector, setShowLevelSelector] = useState(false);
  const [showLevelCompleted, setShowLevelCompleted] = useState(false);
  const [showClosestWords, setShowClosestWords] = useState(false);
  const [showPlayers, setshowPlayers] = useState(false);

  const [isClosestWordsLoading, setIsClosestWordsLoading] = useState(false);

  const guessNotificationContext = useGuessNotificationContext();

  useEffect(() => {
    // TODO handle join lobby from url directly
    if (!isConnected) {
      console.error("JOINED FROM URL");
      /**
       * Start socket
       * Validate lobby id - notification on failure
       * join lobby - ensure not full
       */
      // startSocket();
      router.push("/");
    }

    return () => {
      disconnect();
    };
  }, []);

  useEffect(() => {
    if (Array.isArray(completedGames) && completedGames.includes(currentLevel)) {
      setShowLevelCompleted(true);
    } else {
      setShowLevelCompleted(false);
    }
  }, [currentLevel]);

  useEffect(() => {
    if (completedGames?.includes(currentLevel)) setShowLevelCompleted(true);
  }, [completedGames]);

  // TODO - backend
  // const updateGameStateGuesses = (guess) => {
  //   [level]: {
  //     lastGuess: { ...guess, guesseId: null },
  //     currentColdStreak: pos > prevGuess?.pos ? prevColdStreak + 1 : 0,
  //     currentHotStreak: pos < prevGuess?.pos ? prevHotStreak + 1 : 0,
  //     longestColdStreak: Math.max(prevColdStreak, gameState.games[level]?.longestColdStreak) || 0,
  //     longestHotStreak: Math.max(prevHotStreak, gameState.games[level]?.longestHotStreak) || 0,
  //     guesses: [...(gameState.games[level] != undefined ? gameState.games[level]?.guesses : []), guess],
  //     correctWord: pos == 0 ? word : gameState.games[level]?.correctWord,
  //     // if already complete, use complete, otherwise if pos == 0 set complete, otherwise null
  //     completedGameState: gameState.games[level]?.completedGameState
  //       ? gameState.games[level].completedGameState
  //       : pos == 0
  //       ? { ...gameState.games[level] }
  //       : null,
  //   }
  // };

  const handleInputSubmit = (word) => {
    guessNotificationContext.clear();

    // check if word already guessed
    const singularizedWord = pluralize.singular(word);
    const previouslyGuessed = games[currentLevel]?.guesses.map(({ word }) => word).includes(singularizedWord);

    if (previouslyGuessed) {
      guessNotificationContext.error(`${singularizedWord} has already been guessed`);
    } else {
      handleGuess(word, currentLevel);
      // try {
      //   let res = await GameAPI.getWordPosForGame(word, level);
      //   updateGameStateGuesses(res);
      // } catch ({ reason, word }) {
      //   // * We cannot handle the error in the gameAPI because the notification context is only available in this file.
      //   // * Perhaps there is a way to create the game api as a react component? Unlikely
      //   switch (reason) {
      //     case RESPONSE_MESSAGE.incorrectGuess:
      //       guessNotificationContext.error(`I'm sorry, I don't know this word`);
      //       break;
      //     default:
      //       guessNotificationContext.error(`Error occurred`);
      //   }
      // }
    }
  };

  // Todo Host priviledges
  const toggleLevelSelectorModal = () => {
    if (showLevelCompleted) setShowLevelCompleted(false);
    setShowLevelSelector(!showLevelSelector);
  };

  const handleLevelClick = async (clickedLevel) => {
    // if (clickedLevel === "?") {
    //   const token = await GameAPI.getMysteryToken();
    //   setRandomLevelToken(token);
    //   setGameState({
    //     ...gameState,
    //     games: { ...gameState.games, ["?"]: { guesses: [] } },
    //   });
    // } else if (clickedLevel == level && gameState.completedGames.includes(level)) {
    //   setShowLevelCompleted(true);
    // } else {
    //   setGameState({ ...gameState, mostRecentLevel: clickedLevel });
    // }

    // setLevel(clickedLevel);
    handleChangeLevel(clickedLevel);
    guessNotificationContext.clear();
    toggleLevelSelectorModal();
  };

  const closeLevelCompletedModal = () => {
    if (showLevelSelector) setShowLevelSelector(false);
    setShowLevelCompleted(false);
  };

  const closeClosestWordsModal = () => {
    setShowClosestWords(false);
  };

  const closePWFModal = () => {
    setshowPlayers(false);
  };

  const handleNextLevelClick = () => {
    const incompleteLevels = levels.filter((num) => !completedGames.includes(num));
    const highestIncompleteLevel =
      incompleteLevels.length > 0 ? Math.max(...incompleteLevels).toString() : Math.max(...levels).toString();

    setShowLevelCompleted(false);
    handleChangeLevel(incompleteLevels.length >= 1 ? highestIncompleteLevel : level);
  };

  const handleSeeClosestWordsClick = async () => {
    setShowClosestWords(true);
    setShowLevelCompleted(false);
    setIsClosestWordsLoading(true);
    const words = await GameAPI.getTop100ForLevel(level);
    setIsClosestWordsLoading(false);
    setClosestWords(words);
  };

  // TODO - backend
  // const getCompletedLevelStats = () => {
  //   const { longestColdStreak, currentColdStreak, longestHotStreak, currentHotStreak, guesses } =
  //     gameState.games[level]?.completedGameState;
  //   const stats = {
  //     guesses: guesses.length + 1,
  //     green: guesses.filter((g) => g.pos < 200).length + 1,
  //     yellow: guesses.filter((g) => g.pos >= 200 && g.pos < 3000).length,
  //     red: guesses.filter((g) => g.pos >= 3000).length,
  //     longestColdStreak: Math.max(currentColdStreak, longestColdStreak),
  //     longestHotStreak: Math.max(currentHotStreak, longestHotStreak),
  //     percentile: "Coming Soon",
  //   };
  //   return stats;
  // };

  // const modalLevels = gameState.levels.map((level) => ({
  //   level,
  //   isComplete: gameState.completedGames.includes(level),
  // }));

  if (!isConnected) return null;

  return (
    <div className="container">
      <Head>
        <title className="title">{`THE WORD - ${currentLevel}`}</title>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5566603516601048"
          crossOrigin="anonymous"
        />
      </Head>

      <main>
        {/* TODO - lobbyModal needs to be refactored completeley with playWithFriendsModal */}
        {showPlayers && (
          <div className="playWithFriendsModal_backdrop" onClick={() => setshowPlayers(false)}>
            <div className="modal_wrapper">
              <div className="modal_closeButton" />
              <div className="players_container" onClick={(e) => e.stopPropagation()}>
                <LobbyModal />
              </div>
            </div>
          </div>
        )}
        {showLevelCompleted && (
          <CompletedLevelmodal
            level={currentLevel}
            handleClose={closeLevelCompletedModal}
            handleNextClick={handleNextLevelClick}
            correctWord={games[currentLevel]?.correctWord}
            handleSeeClosestWordsClick={handleSeeClosestWordsClick}
            stats={games[currentLevel]?.results}
            isMultiplayer={true}
          />
        )}
        {/* {showClosestWords && (
          <ClosestWordList
            words={closestWords}
            isLoading={isClosestWordsLoading}
            handleClose={closeClosestWordsModal}
            guesses={gameState.games[level].guesses.map(({ word }) => word)}
          />
        )} */}
        <div className="header">
          <h1 className="title">{"THE WORD"}</h1>
          <LevelSelectorButton
            level={currentLevel}
            handleClick={() => isHost && toggleLevelSelectorModal()}
            isHighlighted={showLevelSelector}
            isComplete={completedGames.includes(currentLevel)}
          />
        </div>
        {showLevelSelector && (
          <LevelSelectorModal
            levels={levels.map((l) => ({ level: l, isComplete: completedGames.includes(l) }))}
            handleLevelClick={handleLevelClick}
            handleClose={toggleLevelSelectorModal}
          />
        )}

        <div className="lobbyButtons_container">
          <div className="lobbyButtons_leave" onClick={disconnect}>
            Leave
          </div>
          <div className="lobbyButtons_players" onClick={() => setshowPlayers(true)}>
            Lobby
          </div>
        </div>

        <Input handleSubmit={handleInputSubmit} />
        {/* {guessNotificationContext.notificationState === "ERROR" ? (
          <GuessNotification />
        ) : (
          games[currentLevel]?.lastGuess && <GuessCell guess={games[currentLevel]?.lastGuess} isHighlighted={true} />
        )} */}
        {games[currentLevel]?.lastGuesses[socket.id] && (
          <GuessCell
            guess={{ ...games[currentLevel]?.lastGuesses[socket.id], player: socket.id }}
            isHighlighted={true}
          />
        )}
        {games[currentLevel]?.guesses.length === 0 && <HowToPlay />}
        {games[currentLevel]?.guesses.length !== 0 && (
          <GuessList
            guesses={games[currentLevel]?.guesses || []}
            highlightedWords={[games[currentLevel]?.lastGuesses[socket.id]?.word]}
          />
        )}
      </main>
    </div>
  );
};

export default Main;
