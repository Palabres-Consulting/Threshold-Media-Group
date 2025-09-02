import cloudinaryLoader from "@/app/lib/cloudinary";
import Image from "next/image";
import Link from "next/link";

const Logo = () => {
  return (
    <Link href="/" className="">
      <ThresholdLogo />
    </Link>
  );
};

export default Logo;

export const LogoImage = () => {
  return (
    <Image
      loader={cloudinaryLoader}
      src="/images/logo.png"
      alt="Julie Party Planner Logo"
      width={200}
      height={50}
      className="object-contain ml-2"
    />
  );
};

export const ThresholdLogo = () => {
  return (
    <div className="">
      <div className="">
        <h1 className="text-[2rem] font-semibold">THRESHOLD</h1>
        <p className="">Media Group</p>
      </div>
    </div>
  );
};
