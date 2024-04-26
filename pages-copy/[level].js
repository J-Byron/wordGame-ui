//* ████████╗██╗░░██╗███████╗  ░██╗░░░░░░░██╗░█████╗░██████╗░██████╗░
//* ╚══██╔══╝██║░░██║██╔════╝  ░██║░░██╗░░██║██╔══██╗██╔══██╗██╔══██╗
//* ░░░██║░░░███████║█████╗░░  ░╚██╗████╗██╔╝██║░░██║██████╔╝██║░░██║
//* ░░░██║░░░██╔══██║██╔══╝░░  ░░████╔═████║░██║░░██║██╔══██╗██║░░██║
//* ░░░██║░░░██║░░██║███████╗  ░░╚██╔╝░╚██╔╝░╚█████╔╝██║░░██║██████╔╝
//* ░░░╚═╝░░░╚═╝░░╚═╝╚══════╝  ░░░╚═╝░░░╚═╝░░░╚════╝░╚═╝░░╚═╝╚═════╝░
//* https://fsymbols.com/generators/carty/

import { useState, useEffect, useContext } from "react";
import Head from "next/head";
import Header from "@components/Header";
import GuessList from "@components/GuessList";
import Input from "@components/Input";
import { GameAPI } from "api/GameAPI";
import GuessNotificationContext from "@components/GuessNotification/guessNotificationManager";
import GuessNotification from "@components/GuessNotification";
import GuessCell from "@components/GuessCell";
import { RESPONSE_MESSAGE } from "constansts";
import LevelSelectorButton from "@components/LevelSelectorButton";
import { LevelSelectorModal } from "@components/LevelSelectorModal";
import { useRouter } from "next/router";

//TODO Update localStorage item to be ...
// const defaultGameState = {
//   colorMode: "light",
//   isInLobby: false,
//    completedGames: [],
//   games: {
//     [date]: {
//       lastGuess,
//       hintsUsed: 0,
//       guesses: [],
//     },
//   },
// };

const Main = ({ level, levels, token = null }) => {
  const [gameState, setGameState] = useState({ completedGames: [], games: {} });
  const [showLevelSelector, setShowLevelSelector] = useState(false);

  const guessNotificationContext = useContext(GuessNotificationContext);
  const router = useRouter();

  // Initialize state from localStorage
  useEffect(() => {
    // window.localStorage.clear();
    let storedGameState = JSON.parse(window.localStorage.getItem("gameState"));

    if (level === "?") {
      storedGameState.games["?"] = { guesses: [] };
    }

    console.log(storedGameState);

    if (storedGameState != null) {
      setGameState(storedGameState);
    }
  }, []);

  // Only update localStorage with gameState after component is mounted
  // TODO should not be called twice upon mount state update

  useEffect(() => {
    window.localStorage.setItem("gameState", JSON.stringify(gameState));
  }, [gameState]);

  const updateGameStateGuesses = (guess) => {
    setGameState(() => {
      return {
        ...gameState,
        completedGames: [
          ...(gameState.completedGames || []),
          ...(guess.pos == 0 ? [level] : []),
        ],
        games: {
          ...gameState.games,
          [level]: {
            lastGuess: { ...guess, guesseId: null },
            guesses: [
              ...(gameState.games[level] != undefined
                ? gameState.games[level]?.guesses
                : []),
              guess,
            ],
          },
        },
      };
    });
    window.localStorage.setItem("gameState", JSON.stringify(gameState));
  };

  const handleInputSubmit = async (word) => {
    guessNotificationContext.clear();

    // check if word already guessed
    const previouslyGuessed = gameState.games[level]?.guesses
      .map(({ word }) => word)
      .includes(word);

    if (previouslyGuessed) {
      guessNotificationContext.error(`${word} has already been guessed`);
    } else {
      try {
        let res;
        if (token) {
          res = await GameAPI.getWordPosForMysteryDate(word, token);
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

  const toggleModal = () => {
    setShowLevelSelector(!showLevelSelector);
  };

  const handleLevelClick = (clickedLevel) => {
    if (clickedLevel === "?") {
      router
        .push({
          pathname: `/random`,
        })
        .then(() => {
          guessNotificationContext.clear();
          toggleModal();
        });
    } else {
      router
        .push({
          pathname: `/${clickedLevel}`,
        })
        .then(() => {
          guessNotificationContext.clear();
          toggleModal();
        });
    }
  };

  return (
    <div className="container">
      <Head>
        <title className="title">{`THE WORD - ${level}`}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div className="header">
          <Header title="THE WORD" />
          <LevelSelectorButton
            level={level}
            handleClick={toggleModal}
            isHighlighted={showLevelSelector}
          />
        </div>
        <LevelSelectorModal
          levels={levels}
          show={showLevelSelector}
          handleLevelClick={handleLevelClick}
          handleOutsideClick={toggleModal}
        />
        <Input handleSubmit={handleInputSubmit} />

        {/* TODO should create a component to dynamically display notification/lastGuess */}

        {guessNotificationContext.notificationState === "ERROR" ? (
          <GuessNotification />
        ) : (
          gameState.games[level]?.lastGuess && (
            <GuessCell guess={gameState.games[level]?.lastGuess} />
          )
        )}

        <GuessList guesses={gameState.games[level]?.guesses || []} />
      </main>
    </div>
  );
};

export default Main;

export async function getStaticProps({ params }) {
  const { gameNumbers: levels } = await GameAPI.getGames();
  const { level } = params;
  return {
    props: { level, levels: levels.reverse() },
  };
}

export async function getStaticPaths() {
  // Generate paths for all levels
  const { gameNumbers } = await GameAPI.getGames();

  const paths = gameNumbers.map((game) => ({
    params: { level: game },
  }));
  return {
    paths,
    fallback: false, // 404 for undefined paths
  };
}
