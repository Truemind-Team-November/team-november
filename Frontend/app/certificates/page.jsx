"use client";
import Sidebar from "@/components/SideBar";
import Image from "next/image";

export default function CertificatesPage() {
  return (
    <main
      className="flex min-h-screen font-sans text-white bg-[#0b1120]"
      style={{ fontFamily: "var(--font-inter), 'Inter', sans-serif" }}
    >
      <Sidebar activeTab="Certificates" />
      <div
        className="flex-1 w-full flex flex-col min-h-screen"
        style={{ background: "#0B1422" }}
      >
        {/* Top Bar */}
        <div
          className="flex items-center justify-between px-8 py-5"
          style={{
            background: "#101723",
            borderBottom: "0.75px solid rgba(214,227,245,0.25)",
          }}
        >
          <span className="text-white font-bold text-3xl tracking-tight">
            My Certificates
          </span>
          <button
            className="flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-lg opacity-50 hover:opacity-100 transition-opacity duration-200"
            style={{
              border: "0.5px solid rgba(214,227,245,0.4)",
              background: "transparent",
              color: "#0950C3",
            }}
          >
            Share All
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-col gap-5 p-7 flex-1">
          {/* Progress Banner */}
          <div
            className="flex flex-wrap items-center gap-6 px-6 py-7 rounded-2xl"
            style={{ background: "#101723", border: "1px solid #0950C3" }}
          >
            <Image
              src="/assets/certificates/certficates-page-icon.svg"
              width={32}
              height={32}
              alt="certificate-page-icon"
              className="w-auto h-auto"
            />{" "}
            <div className="flex-1 min-w-48">
              <div>
                <h2 className="text-white font-bold text-xl mb-1">
                  You're 28% away from your next certificate!
                </h2>
                <p
                  className="text-sm"
                  style={{ color: "rgba(255,255,255,0.7)" }}
                >
                  Complete UI/UX Fundamentals to earn your certificate.
                </p>
              </div>

              <div
                className="flex flex-col gap-1.5"
                style={{ minWidth: "180px", flex: "0 0 220px" }}
              >
                <div
                  className="w-full h-2.5 rounded-full overflow-hidden"
                  style={{ background: "rgba(125,127,130,0.4)" }}
                >
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: "72%",
                      background:
                        "linear-gradient(90deg, #627185 0%, #ADC7EB 100%)",
                    }}
                  />
                </div>
              </div>
            </div>
            <button className="flex bg-[#0950C3] text-[#FAFCFF] border-none items-center gap-2 px-4 py-2.5 rounded-lg font-bold text-sm shrink-0 transition-colors duration-200">
              Continue{" "}
              <Image
                src="/assets/certificates/arrow-right.svg"
                width={18}
                height={14}
                alt="arrow-right"
                className="w-auto h-auto"
              />
            </button>
          </div>

          {/* Certificate Card */}
          <div
            className="relative flex-1 rounded-2xl overflow-hidden flex flex-col justify-between p-8 md:p-14 lg:p-20"
            style={{
              background:
                "linear-gradient(180deg, #101723 0%, #2D3D58 48%, #051838 80%)",
              border: "1px solid #0950C3",
              minHeight: "560px",
            }}
          >
            {/* Corner Stars */}
            <div className="absolute top-8 left-8">
              <Image
                src="/assets/certificates/star.svg"
                width={30}
                height={30}
                alt="star"
                className="w-auto h-auto opacity-50"
              />
            </div>
            <div className="absolute top-8 right-8">
              <Image
                src="/assets/certificates/star.svg"
                width={30}
                height={30}
                alt="star"
                className="w-auto h-auto opacity-50"
              />
            </div>
            <div className="absolute bottom-8 left-8">
              <Image
                src="/assets/certificates/star.svg"
                width={30}
                height={30}
                alt="star"
                className="w-auto h-auto opacity-50"
              />
            </div>
            <div className="absolute bottom-8 right-8">
              <Image
                src="/assets/certificates/star.svg"
                width={30}
                height={30}
                alt="star"
                className="w-auto h-auto opacity-50"
              />
            </div>

            {/* Certificate Body */}
            <div className="flex flex-col items-center gap-2.5 z-10 w-full max-w-2xl mx-auto text-center mt-6">
              <span
                className="font-bold text-xs tracking-widest uppercase"
                style={{ color: "#DCE3EF" }}
              >
                Certificate of Completion
              </span>

              <p
                className="font-bold text-2xl md:text-3xl m-0 mt-4 md:mt-8"
                style={{ color: "#DCE3EF" }}
              >
                TrueMinds Innovation
              </p>

              <span
                className="text-sm mt-1"
                style={{ color: "rgba(255,255,255,0.7)" }}
              >
                This is to certify that
              </span>

              <p
                className="font-bold text-3xl md:text-5xl m-0 mt-2 md:mt-4"
                style={{ color: "#0950C3" }}
              >
                Adaeze Okoro
              </p>

              {/* Horizontal Divider at the bottom of the name */}

              <span
                className="text-sm md:text-base font-medium"
                style={{ color: "rgba(255,255,255,0.9)" }}
              >
                has successfully completed Product Thinking
              </span>

              <span
                className="text-sm md:text-base font-medium mt-1 mb-8"
                style={{ color: "rgba(255,255,255,0.9)" }}
              >
                with a final score of 92/100
              </span>
              <div className="flex w-full items-center gap-2.5 my-4 md:my-6">
                <div
                  className="flex-1 h-px"
                  style={{ background: "#0950C3" }}
                />
                <Image
                  src="/assets/certificates/blue-star.svg"
                  width={15}
                  height={15}
                  alt="blue-star"
                  className="w-auto h-auto"
                />
                <div
                  className="flex-1 h-px"
                  style={{ background: "#0950C3" }}
                />
              </div>
            </div>

            {/* Footer Elements */}
            <div className="flex flex-col sm:flex-row justify-between items-center sm:items-end w-full z-10 gap-8 mt-auto px-4 md:px-8">
              {/* Instructor Signature — bottom left */}
              <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
                <p className="font-bold text-xl md:text-2xl text-white m-0">
                  Chioma Adeyemi
                </p>
                <div
                  className="my-2 h-px"
                  style={{
                    width: "200px",
                    background: "rgba(255,255,255,0.2)",
                  }}
                />
                <p className="font-bold text-base md:text-lg text-white m-0">
                  Chioma Adeyemi
                </p>
                <p className="text-xs mt-1 m-0" style={{ color: "#D6E3F5" }}>
                  Instructor — TrueMinds Innovation
                </p>
              </div>

              {/* Certificate Meta — bottom right */}
              <div className="flex flex-col items-center sm:items-end text-center sm:text-right">
                <p className="text-sm mb-1.5 m-0" style={{ color: "#ADC7EB" }}>
                  Issued: March 15, 2025
                </p>
                <p className="text-sm mb-1.5 m-0" style={{ color: "#ADC7EB" }}>
                  ID: TMI-CERT-2025-0031
                </p>
                <p
                  className="text-sm m-0 font-medium"
                  style={{ color: "#0950C3" }}
                >
                  Verify at trueminds.ng/cert
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
