import { TranslationSchema } from '@/app/lib/locale'
import React from 'react'

const ProcessSection = ({dict}: {dict: TranslationSchema["main"]}) => {
  return (
    <div className="lg:px-6 px-3 py-10 " id="process">
          <div className="flex flex-col text-center mb-14">
            <h2 className="text-[3rem] font-bold mb-6">
              {/* {dict.about.process.title} */}
            </h2>
            <p className="text-foreground/50">
              {/* {dict.about.process.description} */}
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-4 justify-center items-center w-full">
            <div className="lg:w-[70%] w-full flex gap-3">
              <div className="w-[50%] h-[53vh] rounded-2xl overflow-hidden flex items-end relative border-sub">
                <div className="absolute h-full w-full">{/* {image} */}</div>
                <h2 className="text-[5rem] font-black z-50 text-white absolute bottom-[-30px] left-[0px]">
                  01
                </h2>
                <div className="absolute lg:h-full w-full bg-gradient-to-t from-10% from-black/20 via-black/20 via-30% to-70% to-transparent"></div>
              </div>
              <div className="w-[50%] flex gap-3">
                <div className="w-[50%] h-[53vh] rounded-2xl overflow-hidden flex items-end relative border-sub">
                  <div className="absolute lg:h-full w-full bg-gradient-to-t from-10% from-black/20 via-black/20 via-30% to-70% to-transparent"></div>
                  <div className="absolute h-full w-full">{/* {image} */}</div>
                  <h2 className="text-[5rem] font-black z-50 text-white absolute bottom-[-30px] left-[0px]">
                    02
                  </h2>
                </div>
                <div className="w-[50%] h-[53vh] rounded-2xl overflow-hidden flex items-end relative border-sub">
                  <div className="absolute h-full w-full">{/* {image} */}</div>
                  <h2 className="text-[5rem] font-black z-50 text-white absolute bottom-[-30px] left-[0px]">
                    03
                  </h2>
                  <div className="absolute lg:h-full w-full bg-gradient-to-t from-10% from-black/20 via-black/20 via-30% to-70% to-transparent"></div>
                </div>
              </div>
            </div>
            <div className="lg:w-[30%] flex flex-col">
              <h3 className="font-semibold text-[1.4rem] mb-4">
                {/* {dict.about.process.stepTitle} */}
              </h3>
              {/* <p className="text-sm">{dict.about.process.stepDescription}</p> */}
            </div>
          </div>
        </div>
  )
}

export default ProcessSection