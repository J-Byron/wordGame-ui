//* ████████╗██╗░░██╗███████╗  ░██╗░░░░░░░██╗░█████╗░██████╗░██████╗░
//* ╚══██╔══╝██║░░██║██╔════╝  ░██║░░██╗░░██║██╔══██╗██╔══██╗██╔══██╗
//* ░░░██║░░░███████║█████╗░░  ░╚██╗████╗██╔╝██║░░██║██████╔╝██║░░██║
//* ░░░██║░░░██╔══██║██╔══╝░░  ░░████╔═████║░██║░░██║██╔══██╗██║░░██║
//* ░░░██║░░░██║░░██║███████╗  ░░╚██╔╝░╚██╔╝░╚█████╔╝██║░░██║██████╔╝
//* ░░░╚═╝░░░╚═╝░░╚═╝╚══════╝  ░░░╚═╝░░░╚═╝░░░╚════╝░╚═╝░░╚═╝╚═════╝░
//* https://fsymbols.com/generators/carty/

import Head from "next/head";
import Header from "@components/Header";
import GuessList from "@components/GuessList";
import Input from "@components/Input";
import { GameAPI } from "GameAPI";
import { useState, useEffect, useContext } from "react";
import NotificationContext from "@components/Notification/notificationManager";
import Notification from "@components/Notification";

//TODO Update localStorage item to be ...
// const defaultGameState = {
//   colorMode: "light",
//   isInLobby: false,
//   games: {
//     [date]: {
//       hintsUsed: 0,
//       guesses: [],
//     },
//   },
// };

const Main = ({ dates }) => {
  // const defaultGameState = {
  //   [date]: {
  //     hintsUsed: 0,
  //     isInLobby: false,
  //     guesses: [],
  //   },
  // };

  const [gameState, setGameState] = useState({});

  // Get last date
  const [date, setDate] = useState(dates[dates.length - 1] || "");

  const notificationCtx = useContext(NotificationContext);

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
  }, [gameState]);

  const updateGameStateGuesses = (guess) => {
    setGameState(() => {
      return {
        [date]: {
          guesses: [
            ...(gameState[date] != undefined ? gameState[date]?.guesses : []),
            guess,
          ],
        },
      };
    });
    window.localStorage.setItem("gameState", JSON.stringify(gameState));
  };

  const handleInputSubmit = async (word) => {
    // TODO Validate word ie prevent duplicates, invalid inputs, invalid symbols

    // check if word already guessed
    const previouslyGuessed = gameState[date].guesses
      .map(({ word }) => word)
      .includes(word);

    if (previouslyGuessed) {
      notificationCtx.error(`${word} has already been guessed`);
    } else {
      const res = await GameAPI.getWordPosForDate(word, date);
      updateGameStateGuesses(res);
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
        <Notification />
        <GuessList guesses={gameState[date]?.guesses || []} />
      </main>
    </div>
  );
};

export default Main;

export async function getStaticProps() {
  const { dates } = await GameAPI.getGameDates();
  return {
    props: { dates },
  };
}
