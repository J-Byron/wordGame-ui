/**
 * When I navigate to /random it should
 *  /mystery-game-number/token to get token for specific game (serverside)
 *  /mystery-game/word/:word send token as X-Access-Token to
 *
 */

import { GameAPI } from "api/GameAPI";
import { useEffect, useState } from "react";
import Level from "./[level]";

const Random = ({ levels }) => {
  const [token, setToken] = useState(null);

  useEffect(() => {
    // Get new ? level token
    const getToken = async () => {
      const rToken = await GameAPI.getMysteryToken();
      setToken(rToken);
    };

    getToken();
  }, []);

  return <Level level={"?"} levels={levels} token={token} />;
};

export async function getStaticProps() {
  const { gameNumbers: levels } = await GameAPI.getGames();
  return {
    props: { levels: levels.reverse() },
  };
}

export default Random;
