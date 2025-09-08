import React from "react";
import CategoryTime from "./category&time";
import Image from "next/image";
import cloudinaryLoader from "@/app/lib/cloudinary";

const ListCard: React.FC<{ index: number | null }> = ({ index }) => {
  return (
    <div className="lg:h-[30%] flex items-center gap-1 pt-6 border-sub-bottom py-4">
      <div className="w-[40%] relative   h-[7.5em] rounded-2xl overflow-hidden bg-foreground/10">
        <strong className="text-[2.5rem] font-black absolute bottom-[-15px] text-white left-0">
          {index === null ? "" : `0${index + 1}`}
        </strong>

        {/* <Image
              loader={cloudinaryLoader}
              src={"v1755525333/hero_image_uxpn9r.png"}
              alt={`Partner: ${name}`}
              width={1000}
              height={1000}
              className="object-cover w-full h-full"
              // unoptimized
            /> */}
      </div>
      <div className="w-[60%]  h-full ">
        <div className="p-2 flex flex-col gap-2">
          <CategoryTime
            category="Smartphones"
            readTime="10 mins read"
            back={false}
            bg={true}
          />
          <h2 className="font-semibold text-[1rem]">
            Lorem ipsum dolor sit amet consectetur...
          </h2>
        </div>
      </div>
    </div>
  );
};

export default ListCard;
