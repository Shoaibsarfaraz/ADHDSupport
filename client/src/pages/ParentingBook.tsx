import React from "react";
import { Link } from "react-router-dom";

export default function ParentingBook() {
  return (
    <div className="min-h-screen bg-[#D7E9ED] text-[#263A47]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#30506C]">Parenting Support</h1>
            <p className="text-[#263A47] mt-2">
              Recommended reading for ADHD parenting.
            </p>
          </div>

          <Link
            to="/"
            className="px-4 py-2 rounded-md bg-white text-[#30506C] hover:bg-gray-100 transition font-semibold"
          >
            ← Back Home
          </Link>
        </div>

        {/* Book Card */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-transparent hover:border-[#469CA4] transition">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/3 p-6 flex items-center justify-center bg-[#F4FAFB]">
              <img
                src="/bookimg.jpg"
                alt="The Ultimate ADHD Parenting Handbook cover"
                className="h-72 w-auto rounded-lg shadow-sm object-cover"
              />
            </div>

            <div className="md:w-2/3 p-6">
              <h2 className="text-2xl font-bold text-[#30506C] mb-2">
                The Ultimate ADHD Parenting Handbook
              </h2>
              <p className="text-gray-700 mb-6 leading-relaxed">
                Empowering Your Family to Thrive. Use the options below to view the book
                on Amazon or explore more recommended reading.
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href="https://www.amazon.com.au/Ultimate-ADHD-Parenting-Handbook-Empowering/dp/1394346220/ref=mp_s_a_1_1_sspa?crid=3AHBSA5B5L2FJ&dib=eyJ2IjoiMSJ9.whHAoD8USBsxlr2w_3NUjNgPxjR5N6KtlAtbTq5KrSzkjJc0dKYMD92_JFriEbJJnz8ij0_EpqfbYTmQBWmhbDRdOmK1PTtfo863JNMN-bhjROF1KWGTj9sdTwmeDxeOhNXAdJAcgx16uxmuLcqa3Sa2G_wxsWw42FiqLq7yUjCwHVHyfUEWQArOOdUt7JcxUPvAxMjWNxNj6Hv_1djJOw.UshvMyiVh231Rz6P211IjXplxUbQEJKHA00xTVkzh_Q&dib_tag=se&keywords=the+ultimate+adhd+parenting+handbook&qid=1768399722&sprefix=the+ultimate+adhd%2Caps%2C394&sr=8-1-spons&sp_csd=d2lkZ2V0TmFtZT1zcF9waG9uZV9zZWFyY2hfYXRm&psc=1"
                  target="_blank"
                  rel="noreferrer"
                  className="px-6 py-3 bg-[#469CA4] text-white rounded-md hover:bg-[#3a7d84] hover:text-white transition font-semibold text-center"
                >
                  View
                </a>

                <a
                  href="https://www.adhdsupportaustralia.com.au/recommended-reading/"
                  target="_blank"
                  rel="noreferrer"
                  className="px-6 py-3 bg-white text-[#30506C] rounded-md hover:bg-gray-100 transition font-semibold text-center border"
                >
                  Other Book Options
                </a>
              </div>
            </div>
          </div>
        </div>

        
      </div>
    </div>
  );
}
