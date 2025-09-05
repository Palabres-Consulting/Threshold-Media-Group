import React from "react";

const ForgotPasswordForm = () => {
  return (
    <form className="rounded-2xl p-6 flex flex-col gap-5 lg:w-[35vw] border-sub">
      <div className="text-center">
        <h2 className="text-[2rem] font-bold mb-5">Forgot Password</h2>

        <p className="mb-5">
          Input your email to recover your passowrd. You will receive a recovery
          link in your mail box.
        </p>
      </div>

      <div className="">
        <input className="input" placeholder="Input your email" type="text" />
      </div>

      <button className="btn-var1">Submit</button>
    </form>
  );
};

export default ForgotPasswordForm;
