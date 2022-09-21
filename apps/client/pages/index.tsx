import type { NextPage } from 'next';
import Head from 'next/head';

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Shopper Ave</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div
        id="main"
        style={{
          background: `url('https://images.unsplash.com/photo-1595113316349-9fa4eb24f884?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1472&q=80')`,
        }}
        className="flex h-screen w-screen items-center justify-center bg-cover bg-no-repeat bg-blend-overlay">
        <div className="text-center">
          <h1 className="flex items-center justify-center text-5xl font-bold">
            <img className="mr-2 h-16" src="/logo.png" alt="Shopper Ave" /> Shopper Ave
          </h1>
          <h2 className=" mt-3 text-2xl font-light uppercase">Something Awesome is coming</h2>
        </div>
      </div>
    </div>
  );
};

export default Home;
