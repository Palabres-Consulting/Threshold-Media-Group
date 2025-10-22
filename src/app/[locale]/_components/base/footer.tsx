"use client";

import cloudinaryLoader from "@/app/lib/cloudinary";
import Image from "next/image";
import React from "react";
import Logo, { LogoImage } from "./logo";
import Link from "next/link";

import { SiFacebook, SiLinphone } from "react-icons/si";
import {
  FaFacebook,
  FaMailBulk,
  FaMailchimp,
  FaPhone,
  FaPhoneAlt,
} from "react-icons/fa";
import { useLocalization } from "../../context/localizationContext";
import MainFooter from "./mainFooter";

const Footer: React.FC<{ site: string }> = ({ site }) => {
  if (site === "main") {
    return <MainFooter />;
  }

  return (
    <footer className=" overflow-hidden lg:px-16 px-5   bg-foreground/5  "></footer>
  );
};

export default Footer;
