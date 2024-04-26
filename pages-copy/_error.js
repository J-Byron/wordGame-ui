//* ████████╗██╗░░██╗███████╗  ░██╗░░░░░░░██╗░█████╗░██████╗░██████╗░
//* ╚══██╔══╝██║░░██║██╔════╝  ░██║░░██╗░░██║██╔══██╗██╔══██╗██╔══██╗
//* ░░░██║░░░███████║█████╗░░  ░╚██╗████╗██╔╝██║░░██║██████╔╝██║░░██║
//* ░░░██║░░░██╔══██║██╔══╝░░  ░░████╔═████║░██║░░██║██╔══██╗██║░░██║
//* ░░░██║░░░██║░░██║███████╗  ░░╚██╔╝░╚██╔╝░╚█████╔╝██║░░██║██████╔╝
//* ░░░╚═╝░░░╚═╝░░╚═╝╚══════╝  ░░░╚═╝░░░╚═╝░░░╚════╝░╚═╝░░╚═╝╚═════╝░
//* https://fsymbols.com/generators/carty/

import Head from "next/head";
import Header from "@components/Header";
import GuessCell from "@components/GuessCell";

const CustomErrorPage = ({ statusCode }) => {
  return (
    <div className="container">
      <Head>
        <title className="title">{`THE WORD - ${statusCode}`}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Header title="Page not found" />
        <GuessCell guess={{ word: "error", pos: 404 }} />
      </main>
    </div>
  );
};

export default CustomErrorPage;
