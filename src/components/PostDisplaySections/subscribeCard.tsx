"use client";

import React, { useState } from "react";

const SubscribeCard = () => {
  const [isAuth, setIsAuth] = useState(false);

  return (
    <div className="rounded-2xl flex flex-col  p-7 bg-foreground/5">
      <div className="border-sub-bottom pb-7 flex justify-center">
        <p className="">
          La suite est reservee a nos abonnes. Deja Abonne ?{" "}
          <span className="text-accent-main font-semibold">Se Connecter</span>
        </p>
      </div>

      <div className="flex flex-col gap-6 items-center text-center pt-3">
        <h2 className="font-bold text-[3rem]">Envie de lire la suite?</h2>
        <p className="">
          les articles du Monde en integralite a patir de 7,99 e/ E/mois
        </p>

        <button className="btn-var1">Je m'abonne</button>
      </div>
    </div>
  );
};

export default SubscribeCard;
