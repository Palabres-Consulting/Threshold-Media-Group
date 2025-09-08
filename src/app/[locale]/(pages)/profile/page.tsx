"use client";

import ProfileSectionsContainer, {
  ProfileDetails,
  ProfileItem,
} from "@/app/[locale]/_components/sections/profileSectionsContainer";
import SavedArticles from "@/app/[locale]/_components/sections/savedArticles";
import React from "react";
import { getDictionary } from "@/app/lib/dict";
import { useLocalization } from "../../context/localizationContext";

const ProfilePage = () => {
  const { dict } = useLocalization();

  return (
    <section className="flex lg:mx-16 mx-3 py-10 lg:py-0">
      <div className="lg:w-[24%] lg:flex hidden border-sub-side relative">
        <ProfileDetails />
      </div>
      <div className="lg:w-[76%] lg:p-6 flex flex-col gap-8 ">
        <ProfileSectionsContainer title={dict.profile.sections.personalInfo}>
          <ProfileItem
            editButton={true}
            title={dict.profile.items.title}
            value="John Doe"
          />
          <ProfileItem
            editButton={false}
            title={dict.profile.items.email}
            value="johndoe@gmail.com"
          />
          <ProfileItem
            editButton={true}
            title={dict.profile.items.password}
            value="*******"
          />
        </ProfileSectionsContainer>

        <ProfileSectionsContainer title={dict.profile.sections.subscription}>
          <ProfileItem
            editButton={false}
            title={dict.profile.sections.subscription}
            value={dict.profile.items.subscriptionStatus}
          />
        </ProfileSectionsContainer>

        <ProfileSectionsContainer title={dict.profile.sections.help}>
          <ProfileItem
            editButton={false}
            title="By Mail"
            value={dict.profile.items.helpByMail}
          />
        </ProfileSectionsContainer>

        <ProfileSectionsContainer title={dict.profile.sections.savedArticles}>
          <SavedArticles />
        </ProfileSectionsContainer>
      </div>
    </section>
  );
};

export default ProfilePage;
