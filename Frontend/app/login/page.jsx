export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#0B1220] flex items-center justify-center p-6">
      <div className="w-full max-w-6xl grid md:grid-cols-2 rounded-2xl overflow-hidden shadow-2xl">

        
        <div className="bg-gradient-to-br from-[#0B1220] to-[#0E1A2B] p-10 text-white">
          <h1 className="text-xl font-semibold">
            Talent<span className="text-blue-500">Flow</span>.
          </h1>

          <h2 className="mt-10 text-3xl font-bold leading-snug">
            Learn. Build.
            <br />
            <span className="text-blue-500">Grow Together.</span>
          </h2>

          <p className="mt-4 text-gray-400 text-sm">
           TrueMinds innovation’s unified learning <br />
           platform for 50+ interns across all <br />
           disciplines.
          </p>

          <div className="mt-10 space-y-5 text-sm">
            <p>📚<span className="font-semibold">Structured Courses</span> - Access curated learning paths</p>
            <p>📈 <span className="font-semibold">Progress Tracking</span> - See your growth in real life</p>
            <p>🏆 <span className="font-semibold">Earn Certificates</span> - on 100% course completion</p>
            <p>🤝 <span className="font-semibold">Team Collaboration</span> - Work with cross functional team</p>
          </div>
        </div>

        
        <div className="bg-[#0E1A2B] p-10 text-white">
          <h2 className="text-2xl font-semibold">Welcome back</h2>
          <p className="text-sm text-gray-400 mt-1">
            New to TalentFlow?{" "}
            <span className="text-blue-500 cursor-pointer">Create an account</span>
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

            {/* Button */}
            <button className="w-full bg-blue-600 py-3 rounded-lg hover:bg-blue-700 transition">
              Sign in
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3 text-gray-400 text-sm">
              <hr className="flex-1 border-gray-600" />
              or continue with
              <hr className="flex-1 border-gray-600" />
            </div>

            {/* Google */}
            <button className="w-full border border-gray-600 py-3 rounded-lg hover:bg-gray-800">
              Google Workspace
            </button>

            {/* SOS */}
            <button className="w-full bg-gray-700 py-3 rounded-lg opacity-70 cursor-not-allowed">
              SOS LOGIN
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}