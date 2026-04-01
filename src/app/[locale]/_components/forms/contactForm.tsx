import { TranslationSchema } from "@/app/lib/locale";
import React from "react";

const ContactForm = ({dict}: {dict: TranslationSchema["main"]}) => {
  return (
    <form className="p-2 flex flex-col gap-4">
  <div className="">
    <label>{dict.contact.contactForm.fullName.label}</label>
    <div className="flex gap-3">
      <input 
        type="text" 
        placeholder={dict.contact.contactForm.fullName.firstNamePlaceholder} 
        className="input" 
      />
      <input 
        type="text" 
        placeholder={dict.contact.contactForm.fullName.lastNamePlaceholder} 
        className="input" 
      />
    </div>
  </div>

  {/* Email */}
  <div className="">
    <label>{dict.contact.contactForm.email.label}</label>
    <div className="flex gap-3">
      <input 
        type="text" 
        placeholder={dict.contact.contactForm.email.placeholder} 
        className="input" 
      />
    </div>
  </div>


  <div className="">
    <label>{dict.contact.contactForm.message.label}</label>
    <div className="flex gap-3">
      <textarea
        name=""
        id=""
        className="input resize-none h-[10em]"
        placeholder={dict.contact.contactForm.message.placeholder}
      ></textarea>
    </div>
  </div>

  <div className="flex justify-center">
    <button
      type="submit"
      className="bg-accent-main px-5 w-full  py-3 rounded-lg text-white"
    >
      {dict.contact.submit}
    </button>
  </div>
</form>
  );
};

export default ContactForm;
