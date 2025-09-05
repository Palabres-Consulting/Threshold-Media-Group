import ProfileSectionsContainer, {
  ProfileDetails,
  ProfileItem,
} from "@/app/_components/sections/profileSectionsContainer";
import React from "react";

const ProfilePage = () => {
  return (
    <section className="flex">
      <div className="lg:w-[20%] lg:flex hidden">
        <ProfileDetails />
      </div>
      <div className="w-[80%] p-6 flex flex-col gap-8">
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

          <ProfileSectionsContainer title="Saved Articles">
            <div className=""></div>
          </ProfileSectionsContainer>
        </ProfileSectionsContainer>
      </div>
    </section>
  );
};

export default ProfilePage;
