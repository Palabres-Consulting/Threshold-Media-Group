"use client";

import ProfileSectionsContainer, {
  ProfileDetails,
} from "@/components/profilePage/profileSectionsContainer";

import SavedArticles from "@/components/profilePage/savedArticles";
import React from "react";
import { ProfileItem } from "../../../../components/profilePage/profileItem";
import { useUser } from "../../hook/useUser";
import { useTranslations } from "@/lib/locale/context/translationContext";

const ProfilePage = () => {
  const dict = useTranslations("main");

  const { data: user } = useUser();

  console.log(user);

  console.log("Avatar type:", user?.avatar_type);

  return (
    <section className="flex lg:mx-10 mx-3 py-10 lg:py-0">
      <div className="lg:w-[24%] lg:flex hidden border-sub-side relative">
        <ProfileDetails
          avatar_url={user?.avatar_url || ""}
          username={user?.title}
          subscriber={true}
        />
      </div>
      <div className="lg:w-[76%] lg:p-6 flex flex-col gap-8 ">
        <ProfileSectionsContainer title={dict.profile.sections.personalInfo}>
          <ProfileItem
            editButton={true}
            title={dict.profile.items.title}
            value={user?.title}
          />
          <ProfileItem
            editButton={false}
            title={dict.profile.items.email}
            value={user?.email}
          />

          <ProfileItem
            editButton={true}
            title="Interests"
            value={user?.interests || []}
          />

          {user?.avatar_type === "persona" && (
            <ProfileItem
              editButton={true}
              title="Persona"
              value={user?.avatar_url}
            />
          )}

          <ProfileItem
            editButton={
              (user?.password && !user?.password.startsWith("oauth:")) || true
            }
            title={dict.profile.items.password}
            value={user?.password || "********"}
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
