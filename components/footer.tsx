

export default function Footer() {
  return (
    <footer className="w-full bg-black px-6 py-12 text-white md:px-12 md:py-16">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 md:grid-cols-2">

        {/* LEFT */}
        <div className="flex flex-col">
          <h2 className="text-3xl font-bold">
            CrumbShare
          </h2>

          <p className="mt-2 text-gray-400">
            Created by Ms. Tetra
          </p>

          <div className="mt-8">
            <h3 className="text-lg font-semibold">
              Get to Know Us
            </h3>

            <div className="mt-4 flex gap-4">
              <a
                href="#"
                aria-label="Instagram"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 transition hover:bg-white hover:text-black"
              >
                IG
              </a>

              <a
                href="#"
                aria-label="X"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 transition hover:bg-white hover:text-black"
              >
                X
              </a>

              <a
                href="#"
                aria-label="Facebook"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 transition hover:bg-white hover:text-black"
              >
                FB
              </a>
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="grid grid-cols-2 gap-x-8 gap-y-10 md:grid-cols-3">

          {/* Action */}
          <div>
            <h3 className="font-semibold">
              Action
            </h3>

            <ul className="mt-4 space-y-3 text-gray-400">
              <li>
                <a href="#" className="transition hover:text-white">
                  Donors
                </a>
              </li>

              <li>
                <a href="#" className="transition hover:text-white">
                  Recipients
                </a>
              </li>
            </ul>
          </div>

          {/* Programs */}
          <div>
            <h3 className="font-semibold">
              Programs
            </h3>

            <ul className="mt-4 space-y-3 text-gray-400">
              <li>
                <a href="#" className="transition hover:text-white">
                  Find Food
                </a>
              </li>

              <li>
                <a href="#" className="transition hover:text-white">
                  Sharing Food
                </a>
              </li>

              <li>
                <a href="#" className="transition hover:text-white">
                  Donate Food
                </a>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div className="col-span-2 md:col-span-1">
            <h3 className="font-semibold">
              Company
            </h3>

            <ul className="mt-4 space-y-3 text-gray-400">
              <li>
                <a href="#" className="transition hover:text-white">
                  Team
                </a>
              </li>

              <li>
                <a href="#" className="transition hover:text-white">
                  About Us
                </a>
              </li>

              <li>
                <a href="#" className="transition hover:text-white">
                  Contact Us
                </a>
              </li>

              <li>
                <a href="#" className="transition hover:text-white">
                  Help Center
                </a>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* Bottom */}
      <div className="mx-auto mt-12 max-w-6xl border-t border-white/10 pt-6 text-sm text-gray-500">
        © {new Date().getFullYear()} CrumbShare. All rights reserved.
      </div>
    </footer>
  );
}