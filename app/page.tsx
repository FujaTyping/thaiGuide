import Banner from "./components/index/banner";
import Tools from "./components/index/tools";
//import Exploreth from "./components/index/exploreth";
import Activities from "./components/index/activities";
import Faq from "./components/index/faq";
import Roadtrip from "./components/index/roadtrip";
import Resturant from "./components/index/resturant";
import Didyouknow from "./components/didyouknow";

export default function Home() {
  return (
    <>
      <Banner />
      <Tools />
      {/*<Exploreth />*/}
      <Resturant />
      <Roadtrip />
      <Activities />
      <Faq />
      
    </>
  );
}
