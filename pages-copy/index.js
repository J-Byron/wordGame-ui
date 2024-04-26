import { useEffect } from "react";
import { useRouter } from "next/router";
import { GameAPI } from "api/GameAPI";

function Index({ gameNumbers }) {
  const router = useRouter();

  useEffect(() => {
    const storedGameState = JSON.parse(
      window.localStorage.getItem("gameState")
    );

    const { completedGames } = storedGameState;

    const incompleteLevels = gameNumbers.filter(
      (num) => !completedGames.includes(num)
    );

    const highestIncompleteLevel =
      incompleteLevels.length > 0
        ? Math.max(...incompleteLevels)
        : Math.max(...gameNumbers);

    // when navigating from root, redirect to highestIncomplete level OR if all games complete, highest level.
    router.push({
      pathname: `/${highestIncompleteLevel}`,
    });
  }, [router]);

  return null;
}

export async function getStaticProps({ params }) {
  const { gameNumbers } = await GameAPI.getGames();
  return {
    props: { gameNumbers },
  };
}

export default Index;
