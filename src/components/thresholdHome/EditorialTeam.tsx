import Link from "next/link";
import React from "react";
import { FaFacebook, FaInstagram, FaLinkedin } from "react-icons/fa";

const EditorialTeam: React.FC<{ dict: any; id: string }> = ({ dict, id }) => {
  const team = [
    {
      id: 0,
      name: "Jonathan Siuu",
      role: "Founder & CEO",
      linkedIn: "#",
      facebook: "#",
      instagram: "#",
      image: "#",
    },
    {
      id: 1,
      name: "Jonathan Siuu",
      role: "Founder & CEO",
      linkedIn: "#",
      facebook: "#",
      instagram: "#",
      image: "#",
    },
    {
      id: 2,
      name: "Jonathan Siuu",
      role: "Founder & CEO",
      linkedIn: "#",
      facebook: "#",
      instagram: "#",
      image: "#",
    },
    {
      id: 3,
      name: "Jonathan Siuu",
      role: "Founder & CEO",
      linkedIn: "#",
      facebook: "#",
      instagram: "#",
      image: "#",
    },
  ];

  return (
    <div className="py-20 my-10 border-sub-y lg:p-6 p-3" id={id}>
      <div className="flex flex-col text-center mb-14">
        <h2 className="text-[3rem] font-bold mb-6">
          {dict.about.editorialTeam.title}
        </h2>
        <p className="text-foreground/50">
          {dict.about.editorialTeam.description}
        </p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-4 md:grid-cols-2 gap-8">
        {team.map(
          ({ id, facebook, image, instagram, linkedIn, name, role }) => (
            <div key={id} className="flex flex-col h-[55vh] gap-4">
              <div className="h-[80%] rounded-2xl bg-foreground/5">
                {/* {image} */}
              </div>
              <div className="h-[20%] flex justify-between">
                <div className="flex flex-col gap-2">
                  <h5 className="text-sm">{name}</h5>
                  <p className="text-xs">{role}</p>
                </div>
                <div>
                  <ul className="flex gap-2">
                    <li className="flex h-fit">
                      <Link
                        href={facebook}
                        className="rounded-full p-2 text-[1rem] border-sub bg-foreground/5 "
                      >
                        <FaFacebook />
                      </Link>
                    </li>
                    <li className="flex h-fit">
                      <Link
                        href={instagram}
                        className="rounded-full p-2 text-[1rem] border-sub bg-foreground/5"
                      >
                        <FaInstagram />
                      </Link>
                    </li>
                    <li className="flex h-fit">
                      <Link
                        href={linkedIn}
                        className="rounded-full p-2 text-[1rem] border-sub bg-foreground/5"
                      >
                        <FaLinkedin />
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default EditorialTeam;
