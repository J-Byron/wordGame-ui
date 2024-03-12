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
import { GameAPI } from "GameAPI";
import GuessNotificationContext from "@components/GuessNotification/guessNotificationManager";
import GuessNotification from "@components/GuessNotification";
import GuessCell from "@components/GuessCell";
import { RESPONSE_MESSAGE } from "constansts";

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

const Main = ({ gameNumbers }) => {
  const [gameState, setGameState] = useState({});

  // Get last date
  const [gameNumber, setGameNumber] = useState(
    gameNumbers[gameNumbers.length - 1] || ""
  );

  const guessNotificationContext = useContext(GuessNotificationContext);

  // Initialize state from localStorage
  useEffect(() => {
    // window.localStorage.clear();
    const storedGameState = JSON.parse(
      window.localStorage.getItem("gameState")
    );

    if (storedGameState?.guesses?.length != 0 && storedGameState != null) {
      setGameState(storedGameState);
    }
  }, []);

  // Only update localStorage with gameState after component is mounted
  // TODO should not be called twice upon mount state update

  useEffect(() => {
    window.localStorage.setItem("gameState", JSON.stringify(gameState));
    console.log("did win?", gameState.completedGames?.includes(gameNumber));
  }, [gameState]);

  const updateGameStateGuesses = (guess) => {
    setGameState(() => {
      return {
        ...gameState,
        completedGames: [
          ...(gameState.completedGames || []),
          ...(guess.pos == 0 ? [gameNumber] : []),
        ],
        [gameNumber]: {
          lastGuess: { ...guess, guesseId: null },
          guesses: [
            ...(gameState[gameNumber] != undefined
              ? gameState[gameNumber]?.guesses
              : []),
            guess,
          ],
        },
      };
    });
    window.localStorage.setItem("gameState", JSON.stringify(gameState));
  };

  const handleInputSubmit = async (word) => {
    guessNotificationContext.clear();

    // check if word already guessed
    const previouslyGuessed = gameState[gameNumber]?.guesses
      .map(({ word }) => word)
      .includes(word);

    if (previouslyGuessed) {
      guessNotificationContext.error(`${word} has already been guessed`);
    } else {
      try {
        const res = await GameAPI.getWordPosForGame(word, gameNumber);
        updateGameStateGuesses(res);
      } catch ({ reason, word }) {
        // * We cannot handle the error in the gameAPI because the notification context is only available in this file.
        // * Perhaps there is a way to create the game api as a react component? Unlikely

        switch (reason) {
          case RESPONSE_MESSAGE.incorrectGuess:
            guessNotificationContext.error(`${word} is not a valid word`);
            break;
          default:
            guessNotificationContext.error(`Error occurred`);
        }
      }
    }
  };

  return (
    <div className="container">
      <Head>
        <title className="title">THE WORD</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Header title="THE WORD" />
        <Input handleSubmit={handleInputSubmit} />
        <GuessNotification />
        {/* This should be turned into its own component */}
        {gameState[gameNumber]?.lastGuess && (
          <GuessCell guess={gameState[gameNumber]?.lastGuess} />
        )}
        <GuessList guesses={gameState[gameNumber]?.guesses || []} />
      </main>
    </div>
  );
};

export default Main;

export async function getStaticProps() {
  const { gameNumbers } = await GameAPI.getGames();
  return {
    props: { gameNumbers },
  };
}
