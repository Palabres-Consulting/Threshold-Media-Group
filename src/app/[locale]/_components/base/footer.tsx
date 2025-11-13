"use client";

import React from "react";


import MainFooter from "./mainFooter";

const Footer: React.FC<{ site: string }> = ({ site }) => {
  return <MainFooter site={site} />;
};

export default Footer;
