import ProfileSectionsContainer, {
  ProfileDetails,
  ProfileItem,
} from "@/app/_components/sections/profileSectionsContainer";
import SavedArticles from "@/app/_components/sections/savedArticles";
import React from "react";

const ProfilePage = () => {
  return (
    <section className="flex lg:mx-16 mx-3 py-10 lg:py-0">
      <div className="lg:w-[24%] lg:flex hidden border-sub-side relative">
        <ProfileDetails />
      </div>
      <div className="lg:w-[76%] lg:p-6 flex flex-col gap-8 ">
        <ProfileSectionsContainer title="Your Personal Information">
          <ProfileItem editButton={true} title="Title" value="John Doe" />
          <ProfileItem
            editButton={false}
            title="Email"
            value="johndoe@gmail.com"
          />
          <ProfileItem editButton={true} title="Password *" value="*******" />
        </ProfileSectionsContainer>

        <ProfileSectionsContainer title="Your Subscription">
          <ProfileItem
            editButton={false}
            title="Subscription"
            value="You do not have an active subscription at the moment"
          />
        </ProfileSectionsContainer>
        <ProfileSectionsContainer title="Need Help?">
          <ProfileItem
            editButton={false}
            title="By Mail"
            value="Contact our customer service department by email at customercare@gmail.com"
          />
        </ProfileSectionsContainer>

        <ProfileSectionsContainer title="Saved Articles">
          <SavedArticles />
        </ProfileSectionsContainer>
      </div>
    </section>
  );
};

export default ProfilePage;
