import React from "react";

const ServicesComponent: React.FC<{ dict: any }> = ({ dict }) => {
  const services = [
    {
      id: 0,
      title: "A guide to choosing smartphones with good camera",
      image: "",
    },
    {
      id: 1,
      title: "A guide to choosing smartphones with good camera",
      image: "",
    },
    {
      id: 2,
      title: "A guide to choosing smartphones with good camera",
      image: "",
    },
  ];

  return (
    <div className="py-10 border-sub-y lg:p-6 p-3" id="service">
      <div className="flex flex-col text-center mb-14">
        <h2 className="text-[3rem] font-bold mb-6">
          {dict.technology.dataInsight.title}
        </h2>
        <p className="text-foreground/50">
          {dict.technology.dataInsight.description}
        </p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 gap-8">
        {services.map(({ id, image, title }) => (
          <div
            key={id}
            className="h-[53vh] rounded-2xl overflow-hidden flex items-end relative border-sub"
          >
            <div className="absolute h-full w-full">{/* {image} */}</div>
            <div className="absolute lg:h-full w-full bg-gradient-to-t from-10% from-black/20 via-black/20 via-30% to-70% to-transparent"></div>
            <h3 className="z-50 text-[2rem] text-white p-4 font-bold">
              {title.slice(0, 25)}...
            </h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServicesComponent;
