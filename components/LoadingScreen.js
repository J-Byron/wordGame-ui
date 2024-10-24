import Head from "next/head";
import { HowToPlay } from "@components/HowToPlay";
import Input from "@components/Input";

const LoadingScreen = () => {
  return (
    <div className="container">
      <Head>
        <title className="title">THE WORD</title>
      </Head>
      <main>
        <div className="header">
          <h1 className="title">THE WORD</h1>
        </div>
        <Input />
        <HowToPlay />
      </main>
    </div>
  );
};

export default LoadingScreen;
