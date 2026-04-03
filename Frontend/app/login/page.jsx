import Image from "next/image";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#0B1220] flex items-center justify-center p-6">
      <div className="w-full max-w-6xl grid md:grid-cols-2 rounded-2xl overflow-hidden">
        <div className="p-10 text-white border-r border-gray-500">


          <Image src={"/logo.svg"} alt="logo" width={500} height={500} className="w-20 h-20 mb-5" />
          <h1 className="text-4xl font-bold mb-3 text-white">
            Start Your
            <br /> <span className="text-[#0950C3]">Journey</span> Today
          </h1>

          <p className="mt-4 text-gray-400 text-sm">
            TrueMinds innovation’s unified learning
            platform for 50+ interns across all disciplines.
          </p>

          {/* FEATURES */}
          <div className="mt-10 space-y-5 text-sm">

            <div className="flex items-start gap-3">
              <Image width={100} height={100} alt="icon" src="/logo1.png" className="w-5 h-5 mt-1" />
              <p>
                <span className="font-semibold">Structured Courses</span>
                <span className="text-gray-400"> - Access curated learning paths</span>
              </p>
            </div>

            <div className="flex items-start gap-3">
              <Image width={100} height={100} alt="icon" src="/logo2.png" className="w-5 h-5 mt-1" />
              <p>
                <span className="font-semibold">Progress Tracking</span>
                <span className="text-gray-400"> - See your growth in real life</span>
              </p>
            </div>

            <div className="flex items-start gap-3">
              <Image width={100} height={100} alt="icon" src="/logo3.png" className="w-5 h-5 mt-1" />
              <p>
                <span className="font-semibold">Earn Certificates</span>
                <span className="text-gray-400"> - on 100% course completion</span>
              </p>
            </div>

            <div className="flex items-start gap-3">
              <Image width={100} height={100} alt="icon" src="/logo4.png" className="w-5 h-5 mt-1" />
              <p>
                <span className="font-semibold">Team Collaboration</span>
                <span className="text-gray-400"> - Work with cross functional team</span>
              </p>
            </div>

          </div>
        </div>
        <div className="p-10 text-white">
          <h2 className="text-2xl font-semibold">Welcome back</h2>

          <p className="text-sm text-gray-400 mt-1">
            New to TalentFlow?{" "}
            <Link href={"/signup"} className="text-blue-500 cursor-pointer">
              Create an account
            </Link>
          </p>

          <form className="mt-8 space-y-6">

            {/* Email */}
            <div>
              <label className="text-sm">Email Address</label>
              <input
                type="email"
                placeholder="you@trueminds.ng"
                className="w-full mt-2 p-3 rounded-lg bg-transparent border border-gray-600 focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Password */}
            <div>
              <label className="text-sm">Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                className="w-full mt-2 p-3 rounded-lg bg-transparent border border-gray-600 focus:outline-none focus:border-blue-500"
              />

              <div className="text-right mt-2">
                <span className="text-blue-500 text-sm cursor-pointer">
                  Forgot password?
                </span>
              </div>
            </div>

            {/* SIGN IN */}
            <button className="w-full bg-blue-600 py-3 rounded-lg hover:bg-blue-700 transition">
              Sign in
            </button>

            {/* DIVIDER */}
            <div className="flex items-center gap-3 text-gray-400 text-sm">
              <hr className="flex-1 border-gray-600" />
              or continue with
              <hr className="flex-1 border-gray-600" />
            </div>

            {/* GOOGLE */}
            <button className="w-full border border-gray-600 py-3 rounded-lg hover:bg-gray-800 flex items-center justify-center gap-2">
              <Image width={100} height={100} alt="icon" src="/google.png" className="w-5 h-5" />
              Google Workspace
            </button>

            {/* SOS */}
            <button className="w-full bg-gray-700 py-3 rounded-lg opacity-70 cursor-not-allowed flex items-center justify-center gap-2">
              <Image width={100} height={100} alt="icon" src="/sos.png" className="w-5 h-5" />
              SOS LOGIN
            </button>

          </form>
        </div>

      </div>
    </div>
  );
}
