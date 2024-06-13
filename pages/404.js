//* ████████╗██╗░░██╗███████╗  ░██╗░░░░░░░██╗░█████╗░██████╗░██████╗░
//* ╚══██╔══╝██║░░██║██╔════╝  ░██║░░██╗░░██║██╔══██╗██╔══██╗██╔══██╗
//* ░░░██║░░░███████║█████╗░░  ░╚██╗████╗██╔╝██║░░██║██████╔╝██║░░██║
//* ░░░██║░░░██╔══██║██╔══╝░░  ░░████╔═████║░██║░░██║██╔══██╗██║░░██║
//* ░░░██║░░░██║░░██║███████╗  ░░╚██╔╝░╚██╔╝░╚█████╔╝██║░░██║██████╔╝
//* ░░░╚═╝░░░╚═╝░░╚═╝╚══════╝  ░░░╚═╝░░░╚═╝░░░╚════╝░╚═╝░░╚═╝╚═════╝░
//* https://fsymbols.com/generators/carty/

import Head from "next/head";
import GuessCell from "@components/GuessCell";

const CustomErrorPage = ({ statusCode }) => {
  return (
    <div className="container">
      <Head>
        <title className="title">{`THE WORD - ${statusCode}`}</title>
      </Head>

      <main>
        <h1 className="title">{"Page not found"}</h1>

        <GuessCell guess={{ word: "error", pos: 404 }} />
      </main>
    </div>
  );
};

export default CustomErrorPage;
