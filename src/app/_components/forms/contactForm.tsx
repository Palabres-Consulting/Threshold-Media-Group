import React from "react";

const ContactForm = () => {
  return (
    <form className="p-2 flex flex-col gap-4">
      <div className="">
        <label>Pre-nom et nom *</label>
        <div className="flex gap-3">
          <input type="text" placeholder="Prenom" className="input" />
          <input type="text" placeholder="Nom" className="input" />
        </div>
      </div>

      {/* Name */}

      <div className="">
        <label>E-mail *</label>
        <div className="flex gap-3">
          <input type="text" placeholder="E-mail" className="input" />
        </div>
      </div>

      {/* Email */}

      <div className="">
        <label>E-mail *</label>
        <div className="flex gap-3">
          <input type="text" placeholder="E-mail" className="input" />
        </div>
      </div>

      {/* Label */}

      <div className="">
        <label>E-mail *</label>
        <div className="flex gap-3">{/* import shadcn select component */}</div>
      </div>
      <div className="">
        <label>E-mail *</label>
        <div className="flex gap-3">
          <textarea
            name=""
            id=""
            className="input"
            placeholder="Message"
          ></textarea>
        </div>
      </div>

      <div className="">
        <button
          type="submit"
          className="bg-accent-main px-5 py-3 rounded-lg text-white"
        >
          Envoyer
        </button>
      </div>
    </form>
  );
};

export default ContactForm;
