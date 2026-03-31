import Image from "next/image";

export default function Signup() {
  return (
    <section className="bg-[#101723] text-white flex flex-row items-center justify-center min-h-screen p-6 gap-30">
      <div className="h-100 w-150">
        <div>
          <h1 className="text-4xl font-bold mb-3">
            Talent<span className="text-[#0950C3]">Flow</span> <br /> <br />{" "}
            Start Your
            <br /> <span className="text-[#0950C3]">Journey</span> Today
          </h1>
          <p className="text-[#7D7F82] mb-4">
            Join hundreds of interns building real world skills on TalentFlow
          </p>
        </div>
        <div className="w-125">
          <div className="flex flex-row mb-4 gap-2 items-center">
            <div className="p-2 bg-[#314568] rounded-xl">
              <Image src="/Group.png" alt="Logo" width={20} height={20} />
            </div>
            <p>
              <span className="text-white font-bold">Unique ID Assigned</span>
              <span className="text-[#7D7F82] mb-4">
                {" "}
                - every signup gets a permanent
              </span>
              <br /> identifier
            </p>
          </div>
          <div className="flex flex-row mb-4 gap-2 items-center">
            <div className="p-2 bg-[#314568] rounded-xl">
              <Image src="/fill.png" alt="Logo" width={20} height={20} />
            </div>
            <p>
              <span className="text-white font-bold">Team Placement</span>
              <span className="text-[#7D7F82] mb-4">
                {" "}
                - Auto-assigned to your <br />
                discipline team
              </span>
            </p>
          </div>
          <div className="flex flex-row mb-4 gap-2 items-center">
            <div className="p-2 bg-[#314568] rounded-xl">
              <Image src="/target.png" alt="Logo" width={20} height={20} />
            </div>
            <p>
              <span className="text-white font-bold">Role-Based Access</span>
              <span className="text-[#7D7F82] mb-4">
                {" "}
                - Personalized for Leaner, Mentor, <br />
                or Admin
              </span>
            </p>
          </div>
        </div>
      </div>
      <div className="h-150 w-120">
        <h1 className="text-4xl font-bold">Create Account</h1>
        <div className="flex flex-row gap-2">
          <h2 className="text-[#ADC7EB] font-thin text-lg">Sign In</h2>
          <h3 className="text-[#0950C3] font-black text-lg">Log In</h3>
        </div>
        <div className="flex flex-row gap-4 mb-4 mt-6 ">
          <div>
            <label htmlFor="first-name" className="text-3xl mb-2">
              First Name
            </label>

            <br />

            <input
              name="first-name"
              type="text"
              id="first-name"
              placeholder="Enter your first name"
              required
              className="w-full h-10 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mt-2"
            />
          </div>
          <div>
            <label htmlFor="last-name" className="text-3xl ">
              Last Name
            </label>
            <br />
            <input
              name="last-name"
              type="text"
              id="last-name"
              placeholder="Enter your last name"
              required
              className="w-full h-10 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mt-2"
            />
          </div>
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="text-3xl ">
            Email Address
          </label>

          <input
            type="email"
            id="email"
            placeholder="Enter your email address"
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mt-2"
          />
        </div>
        <h2 className="text-3xl ">Discipline</h2>
        <div className="w-full h-10 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mt-2 flex flex-row-reverse items-center mb-8 ">
          <Image src="/dropdown.png" alt="Logo" width={40} height={40} />
        </div>
        <div className="mb-4">
          <label htmlFor="Password" className="text-3xl ">
            Password
          </label>

          <input
            type="password"
            id="Password"
            placeholder="Minimum 8 characters"
            required
            className="w-full h-10 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4 mt-2"
          />
        </div>
        <button className="w-full h-10 bg-[#0950C3] text-white rounded-lg hover:bg-blue-600 transition-colors ">
          Get Started
        </button>
      </div>
    </section>
  );
}
