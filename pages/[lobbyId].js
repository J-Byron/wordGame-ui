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

import { HowToPlay } from "@components/HowToPlay";

import { useSocket } from "@components/Socket/SocketContext";
import { useGuessNotificationContext } from "@components/GuessNotification/guessNotificationContext";
import LobbyModal from "@components/LobbyModal";
import LoadingScreen from "@components/LoadingScreen";
import GuessNotification from "@components/GuessNotification";

const ClosestWordList = dynamic(() => import("@components/ClosestWordList"));
const LevelSelectorButton = dynamic(() => import("@components/LevelSelectorButton"));
const LevelSelectorModal = dynamic(() => import("@components/LevelSelectorModal"));
const CompletedLevelmodal = dynamic(() => import("@components/CompletedLevelModal"));

const validateLobbyId = (value) => {
  const regex = /^[A-Za-z0-9]{5}$/;
  return regex.test(value);
};

const Main = ({ lobbyId: urlLobbyId }) => {
  const {
    lobbyInfo: {
      isHost,
      levels = [],
      players = [],
      gameState: { currentLevel, completedGames, games } = {},
      lobbyid,
      isInGame,
    } = {},
    isConnected,
    disconnect,
    handleGuess,
    startSocket,
    socket,
    handleChangeLevel,
    joinLobby,
  } = useSocket();

  const router = useRouter();

  const [randomLevelToken, setRandomLevelToken] = useState(null);
  const [closestWords, setClosestWords] = useState([]);
  const [joinedFromUrl, setJoinedFromUrl] = useState(false);

  const [showLevelSelector, setShowLevelSelector] = useState(false);
  const [showLevelCompleted, setShowLevelCompleted] = useState(false);
  const [showClosestWords, setShowClosestWords] = useState(false);
  const [showPlayers, setshowPlayers] = useState(false);

  const [isClosestWordsLoading, setIsClosestWordsLoading] = useState(false);

  const guessNotificationContext = useGuessNotificationContext();

  useEffect(() => {
    console.log("mount");
    if (!isConnected) {
      // Joined from URL
      if (!validateLobbyId(urlLobbyId)) {
        router.push("/");
      } else {
        setJoinedFromUrl(true);
        startSocket();
      }
    }

    const handleBeforeUnload = () => {
      disconnect();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  useEffect(() => {
    if (socket && isConnected && joinedFromUrl) {
      if (validateLobbyId(urlLobbyId)) {
        joinLobby(urlLobbyId);
      } else {
        router.push("/");
      }
    }
  }, [socket, isConnected]);

  useEffect(() => {
    if (Array.isArray(completedGames) && completedGames.includes(currentLevel)) {
      setShowLevelCompleted(true);
    } else {
      setShowLevelCompleted(false);
    }
  }, [currentLevel]);

  useEffect(() => {
    if (completedGames?.includes(currentLevel)) setShowLevelCompleted(true);
  }, [completedGames?.length]);

  if (!isConnected) {
    return <LoadingScreen />;
  }

  const handleInputSubmit = (word) => {
    guessNotificationContext.clear();

    // check if word already guessed
    const singularizedWord = pluralize.singular(word);
    const previouslyGuessed = games[currentLevel]?.guesses.map(({ word }) => word).includes(singularizedWord);

    if (previouslyGuessed) {
      guessNotificationContext.error(`${singularizedWord} has already been guessed`);
    } else {
      handleGuess(word, currentLevel);
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

    if (clickedLevel == currentLevel && completedGames.includes(clickedLevel)) {
      setShowLevelCompleted(true);
    } else {
      handleChangeLevel(clickedLevel);
      guessNotificationContext.clear();
    }
    toggleLevelSelectorModal();
  };

  const closeLevelCompletedModal = () => {
    if (showLevelSelector) setShowLevelSelector(false);
    setShowLevelCompleted(false);
  };

  const closeClosestWordsModal = () => {
    setShowClosestWords(false);
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
    const words = await GameAPI.getTop100ForLevel(currentLevel);

    const playerWords = words.map((w) => {
      const found = games[currentLevel]?.guesses.find((g) => g.word === w.word);
      if (found) console.log("found", found);
      return found ? { ...w, player: found.player } : w;
    });
    setIsClosestWordsLoading(false);
    setClosestWords(playerWords);
  };

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

      {isConnected && isInGame && (
        <main>
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
          {showClosestWords && (
            <ClosestWordList
              words={closestWords}
              isLoading={isClosestWordsLoading}
              handleClose={closeClosestWordsModal}
              guesses={games[currentLevel]?.guesses.map(({ word }) => word)}
            />
          )}
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
              Players
            </div>
          </div>

          <Input handleSubmit={handleInputSubmit} />
          {guessNotificationContext.notificationState === "ERROR" ? (
            <GuessNotification />
          ) : (
            games[currentLevel]?.lastGuesses[socket.id] && (
              <GuessCell
                guess={{ ...games[currentLevel]?.lastGuesses[socket.id], player: socket.id }}
                isHighlighted={true}
              />
            )
          )}

          {games[currentLevel]?.guesses.length === 0 && <HowToPlay />}
          {games[currentLevel]?.guesses.length !== 0 && (
            <GuessList
              guesses={games[currentLevel]?.guesses || []}
              highlightedWords={[games[currentLevel]?.lastGuesses[socket.id]?.word]}
            />
          )}
        </main>
      )}
    </div>
  );
};

export default Main;

export async function getServerSideProps(context) {
  const { lobbyId } = context.params;

  // You can fetch data here based on the lobbyId if needed

  return {
    props: {
      lobbyId, // Pass the lobbyId as a prop to the page
    },
  };
}
