import Banner from "./components/index/banner";
import Tools from "./components/index/tools";
import Exploreth from "./components/index/exploreth";
import Activities from "./components/index/activities";
import Faq from "./components/index/faq";
import Roadtrip from "./components/index/roadtrip";

export default function Home() {
  return (
    <>
      <Banner />
      <Tools />
      <Exploreth />
      <Roadtrip />
      <Activities />
      <Faq />
    </>
  );
}
