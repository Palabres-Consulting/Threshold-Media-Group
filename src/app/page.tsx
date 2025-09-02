import CyberSecurityPosts from "./_components/sections/cyberSecurityPosts";
import GreatReads from "./_components/sections/greatReads";
import Hero from "./_components/sections/hero";
import MorePosts from "./_components/sections/morePosts";
import Sidebar from "./_components/sections/sidebar";
import ThresholdOpinions from "./_components/sections/thresholdOpinions";

const Home = () => {
  return (
    <main className="lg:mx-16 mx-2 border-sub-side">
      <Hero />
      <CyberSecurityPosts />

      <div className="w-full flex">
        <div className="lg:w-[70%]">
          <MorePosts />
          <ThresholdOpinions />
          <GreatReads />
        </div>
        <div className="lg:w-[30%] hidden lg:flex">
          <Sidebar />
        </div>
      </div>
    </main>
  );
};

export default Home;
