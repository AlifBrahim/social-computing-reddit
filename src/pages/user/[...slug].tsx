import { useRouter } from "next/router";
import Link from "next/link";
import Head from "next/head";
import NavBar from "../../components/NavBar";
import Feed from "../../components/Feed";
const Sort = ({ query }) => {
  return (
    <div className="overflow-x-hidden overflow-y-auto ">
      <Head>
        <title>{query?.slug?.[0] ? `troddit · ${query?.slug?.[0]}` : "troddit"}</title>
      </Head>
      <main>
        <NavBar />
        <Feed query={query} isUser={true}/>
      </main>
    </div>
  );
};

Sort.getInitialProps = ({ query }) => {
  return { query };
};

export default Sort;
