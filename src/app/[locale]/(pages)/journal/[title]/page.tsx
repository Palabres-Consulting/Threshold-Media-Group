import PageContainer from "@/app/[locale]/_components/sections/pageContainer";
import Sidebar from "@/app/[locale]/_components/sections/sidebar";
import SubscribeCard from "@/app/[locale]/_components/sections/subscribeCard";
import ThresholdOpinions from "@/app/[locale]/_components/sections/thresholdOpinions";
import React from "react";

const UniquePost = () => {
  return (
    <PageContainer id="unique-post" path="" title="Unique Post">
      <div className="w-full flex">
        <div className="lg:w-[70%] ">
          <div className="border-sub p-6">
            <div className="flex gap-6 py-2 text-foreground/50 items-center">
              <p className="text-sm">Product</p>
              <div className="h-[5px] w-[5px] bg-foreground/50 rounded-full"></div>
            </div>

            <div className="flex flex-col gap-10 mb-20">
              <h1 className="lg:text-[3.5rem] text-[2rem] font-bold ">
                Diam ultrices odio ornare sollicitudin habitant viverra ornare
                amet cras
              </h1>

              <div className="rounded-2xl h-[60vh] w-full border-sub bg-foreground/5">
                {/* <Image
            loader={cloudinaryLoader}
            src={"v1755525333/hero_image_uxpn9r.png"}
            alt={`post image`}
            width={1000}
            height={1000}
            className="object-cover w-full h-full"
            // unoptimized
          /> */}
              </div>

              <div className="flex flex-col gap-8">
                <div className="flex flex-col gap-8 relative">
                  <h5 className="font-semibold text-[1.5rem]">
                    Sem lacus, erat venenati
                  </h5>
                  <p className="">
                    Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                    Exercitationem, voluptas. A numquam, sint repudiandae
                    possimus minima, tempore facilis cum placeat similique,
                    dolorum consequatur dicta? Corporis odio officia quas
                    consectetur tenetur?
                  </p>

                  <p className="">
                    Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                    Reprehenderit eius sapiente molestiae non, voluptatem vitae.
                  </p>

                  <div className="absolute top-0 right-0">
                    <strong className="text-accent-main">By Henray Jay</strong>
                  </div>
                </div>
                <div className="flex flex-col gap-6 relative">
                  <h5 className="font-semibold text-[1.5rem]">
                    Sem lacus, erat venenati
                  </h5>
                  <p className="">
                    Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                    Exercitationem, voluptas. A numquam, sint repudiandae
                    possimus minima, tempore facilis cum placeat similique,
                    dolorum consequatur dicta?
                  </p>

                  <p className="">
                    Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                    Reprehenderit eius sapiente molestiae non, voluptatem vitae.
                  </p>
                  <p className="">
                    Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                    Reprehenderit eius sapiente molestiae non, voluptatem vitae.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="border-sub-right p-6">
            <SubscribeCard />
          </div>

          <div className="">
            <ThresholdOpinions />
          </div>
        </div>
        <div className="lg:w-[30%] hidden lg:flex">
          <Sidebar />
        </div>
      </div>
    </PageContainer>
  );
};

export default UniquePost;
