import cloudinaryLoader from "@/app/lib/cloudinary";
import Image from "next/image";
import React from "react";

const EditorialProcess: React.FC<{
  dict: any;
  title: string;
  description: string;
  titleColor: string;
  mainTitle: boolean;
}> = ({ dict, title, description, titleColor, mainTitle }) => {
  return (
    <div className="lg:px-6 px-3 py-10 " id="process">
      {mainTitle && (
        <div className="flex flex-col text-center mb-14">
          <h2 className="text-[3rem] font-bold mb-6">
            {dict.technology.editorialProcess.title}
          </h2>
          <p className="text-foreground/50">
            {dict.technology.editorialProcess.description}
          </p>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-4 justify-center items-center w-full">
        <div className="lg:w-[70%] w-full flex gap-3">
          <div className="w-full lg:h-[53vh] rounded-2xl overflow-hidden flex items-end relative border-sub">
            <Image
              loader={cloudinaryLoader}
              src={"/images/homepage/editorialProcess.png"}
              alt={dict.technology.editorialProcess.title}
              width={1000}
              height={1000}
              className="object-cover w-full h-full"
            />
          </div>
        </div>
        <div className="lg:w-[30%] flex flex-col">
          <h3 className={`font-semibold text-[1.4rem] mb-4 ${titleColor}`}>
            {title}
          </h3>
          <p className="text-sm">
            {dict.technology.editorialProcess.subDescription}
          </p>
        </div>
      </div>
    </div>
  );
};

export default EditorialProcess;
