import Image from "next/image";

const statistics = [
  {
    value: "500+",
    label: "Donors",
  },
  {
    value: "450+",
    label: "Food Recipients",
  },
  {
    value: "100+",
    label: "Projects Successfully Distributed",
  },
];

const testimonials = [
  {
    name: "Sarah",
    role: "Food Donor",
    image: "/images/profile1.jpg",
    comment:
      "It feels great to share excess food and know that it can help someone else.",
  },
  {
    name: "David",
    role: "Recipient",
    image: "/images/profile2.jpg",
    comment:
      "CrumbShare makes it easier for me to find food donations around my community.",
  },
  {
    name: "Michael",
    role: "Volunteer",
    image: "/images/profile3.jpg",
    comment:
      "A simple idea with a meaningful impact. I love being part of something meaningful.",
  },
];

export default function Home() {
  return (
    <main>
      <header></header>
      {/* HERO */}
      <section className="relative z-10 min-h-screen justify-center items-center flex flex-col overflow-hidden bg-gradient-to-bl from-[#8d8d8d] via-[#d2d2d2] to-[#ffffff]" id="home">
        {/* Row 1 */}
        <div className="flex flex-col items-center justify-center md:flex-row">
          {/* Div Col 1 */}
          <div className="order-2 flex w-full flex-col items-start max-w-4xl justify-center px-8 md:order-1 md:w-3/4 md:px-8">
            <h1 className="text-3xl md:text-6xl font-bold text-black">
              Raise Awareness,
              <br />
              Share Excess Foods with Others
            </h1>
            <p className="text-lg mt-1 text-black md:mt-6 md:text-3xl">
              Share the benefits by giving away more food and throwing away less
              for a good charitable cause.
            </p>

            {/* Div Button */}
            <div className="mt-3 md:mt-8 flex gap-4">
              <button className="rounded-full bg-black px-6 py-3 font-semibold border text-white md:w-43 md:text-lg hover:border-black hover:bg-transparent hover:text-black">
                Sign Up
              </button>

              <button className="rounded-full border border-black px-6 py-3 font-semibold text-black md:w-43 md:text-lg hover:bg-black hover:text-white">
                Log In
              </button>
            </div>
          </div>
          {/* Div Col 2 */}
          <div className="order-1 flex w-full items-center justify-center md:order-2 md:w-1/3 md:px-8">
            <Image
              src="/images/datefruit.png"
              alt="Food sharing illustration"
              width={600}
              height={600}
              className="h-auto w-full max-w-xs md:max-w-lg"
            />
          </div>
        </div>
        {/* Number */}
        <div className="md:mt-24 mt-6 grid max-w-4xl w-full grid-cols-3 gap-6 text-center">
          {statistics.map((item) => (
            <div key={item.label}>
              <h3 className="text-2xl font-bold text-black md:text-4xl">
                {item.value}
              </h3>

              <p className="mt-2 text-sm text-gray-700 md:text-2xl">
                {item.label}
              </p>
            </div>
          ))}
        </div>

        {/* Gradient fade */}
        <div className="z-0 absolute bottom-0 left-0 h-40 w-full bg-gradient-to-b from-transparent to-white" />
      </section>

      {/* SECTION 2 */}
      <section className=" bg-white justify-center min-h-screen items-center flex" id="about">
        <div className="items-center justify-center grid grid-cols-1 md:grid-cols-2 px-8 gap-4 text-black w-full md:max-w-6xl">
          <div className="flex justify-center">
            <Image
              src="/images/crumbshare.png"
              alt="Crumbshare Logo"
              width={600}
              height={600}
              className="h-auto w-full max-w-xs md:max-w-lg"
            />
          </div>
          <div className="flex justify-center">
            <p className="text-sm w-full max-w-lg text-justify md:text-2xl">
              Crumbshare serves as a medium to connect donors and recipients. It
              aims to reduce excess food waste and realize the sustainable
              development goal of zero hunger.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 3 */}
      <section className="bg-white min-h-screen justify-center items-center flex flex-col ">
        {/* Ttile */}
        <div className="justify-center flex items-center text-black">
          <h1 className="md:text-4xl text-3xl font-bold">Our Values</h1>
        </div>
        {/* Container */}
        <div className="mx-auto mt-5 md:mt-10 grid w-full max-w-6xl px-7 grid-cols-1 gap-8 text-center text-black md:grid-cols-3">
          {/* Card 1 */}
          <div className="w-full rounded-3xl bg-gradient-to-br from-gray-400/30 via-white/40 to-white/60 p-8 shadow-xl backdrop-blur-lg">
            {/* Image 1 */}
            <div className="justify-center items-center flex">
              <Image
                src="/images/connectivity.png"
                alt="Connectivity illustration"
                width={600}
                height={600}
                className="mx-auto h-auto w-full max-w-28 sm:max-w-36 md:max-w-52"
              />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold">Connectivity</h2>
            <p className="text-sm md:text-lg mt-2 md:mt-4">
              Creating connections between food donors and recipients, either
              directly or through groups, allows for synergy and empathy.
            </p>
          </div>
          <div className="w-full rounded-3xl bg-gradient-to-br from-gray-400/30 via-white/40 to-white/60 p-8 shadow-xl backdrop-blur-lg">
            <div className="justify-center items-center flex">
              <Image
                src="/images/justice.png"
                alt="Justice illustration"
                width={600}
                height={600}
                className="mx-auto h-auto w-full max-w-28 sm:max-w-36 md:max-w-52"
              />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold">Justice</h2>
            <p className="text-sm md:text-lg mt-2 md:mt-4">
              Emphasizes the importance of equitable access to adequate food for
              all people, regardless of background or economic conditions.
            </p>
          </div>
          <div className="w-full rounded-3xl bg-gradient-to-br from-gray-400/30 via-white/40 to-white/60 p-8 shadow-xl backdrop-blur-lg">
            <div className="justify-center items-center flex">
              <Image
                src="/images/care.png"
                alt="Care illustration"
                width={600}
                height={600}
                className="mx-auto h-auto w-full max-w-28 sm:max-w-36 md:max-w-52"
              />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold">Care</h2>
            <p className="text-sm md:text-lg mt-2 md:mt-4">
              Sharing food reflects a sense of mutual care and an awareness of a
              shared responsibility to help those in need and eradicate hunger.
              justice.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 4 */}
      <section className="flex min-h-screen items-center justify-center bg-white px-6 py-12 text-black" id="action">
        <div className="mt-20 w-full max-w-6xl rounded-3xl bg-gradient-to-br from-gray-400/30 via-white/40 to-white/60 p-6 shadow-xl backdrop-blur-lg md:p-10">
          {/* Title */}
          <div className="items-center flex text-center justify-center">
            <h1 className="text-2xl font-bold md:text-4xl max-w-3xl">
              Be part of us by sharing food and spreading happiness.
            </h1>
          </div>

          {/* 2 Columns */}
          <div className="mt-10 grid grid-cols-1 gap-1 md:grid-cols-2">
            {/* As Donor */}
            <div className="flex flex-col items-center">
              <Image
                src="/images/donor.png"
                alt="Donor"
                width={400}
                height={400}
                className="mx-auto h-auto w-full max-w-28 sm:max-w-36 md:max-w-52"
              />

              <button className="rounded-full bg-black mt-4 px-6 py-3 font-semibold border text-white md:w-43 md:text-lg hover:border-black hover:bg-transparent hover:text-black">
                As Donor
              </button>
            </div>

            {/* As Recipient */}
            <div className="flex flex-col items-center">
              <Image
                src="/images/recipient.png"
                alt="Recipient"
                width={400}
                height={400}
                className="mx-auto h-auto w-full max-w-28 sm:max-w-36 md:max-w-52"
              />

              <button className="rounded-full mt-4 bg-black px-6 py-3 font-semibold border text-white md:w-43 md:text-lg hover:border-black hover:bg-transparent hover:text-black">
                As Recipient
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5 */}
      <section className="w-full overflow-hidden bg-white py-20 text-black ">
        {/* Title */}
        <div className="mx-auto max-w-6xl px-6 text-center">
          <h1 className="text-3xl font-bold md:text-4xl">They Said About Us</h1>
        </div>

        {/* Carousel */}
        <div className="flex items-center justify-center mt-12 overflow-x-auto px-6 pb-5 scrollbar-hide snap-x snap-mandatory">
          <div className="flex w-max gap-6">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.name}
                className="w-[85vw] max-w-[480px] shrink-0 snap-center rounded-3xl bg-gradient-to-br from-gray-400/30 via-white/50 to-white/70 p-6 shadow-lg backdrop-blur-lg md:w-[480px] md:p-8"
              >
                {/* Profile */}
                <div className="flex items-center gap-4">
                  <Image
                    src={testimonial.image}
                    alt={testimonial.name}
                    width={60}
                    height={60}
                    className="h-14 w-14 rounded-full object-cover"
                  />

                  <div>
                    <h2 className="font-bold">{testimonial.name}</h2>

                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>

                {/* Comment */}
                <p className="mt-6 text-base leading-relaxed text-gray-700 md:text-lg">
                  "{testimonial.comment}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
