import React from "react";

const SectionHeader: React.FC<{ heading: string; description: string }> = ({
  heading,
  description,
}) => {
  return (
    <div className="flex flex-col text-center mb-14">
      <h2 className="text-[3rem] font-bold mb-6">{heading}</h2>
      <p className="text-foreground/50">{description}</p>
    </div>
  );
};

export default SectionHeader;
