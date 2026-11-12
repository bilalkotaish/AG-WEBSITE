export default function AboutUs() {
  return (
    <section className="bg-white text-gray-800 py-16 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">About AgCell</h1>
          <p className="text-lg text-gray-600">
            A phone store for people who want the device, not the runaround.
          </p>
        </div>

        {/* Company Mission */}
        <div className="grid md:grid-cols-2 gap-8 items-center mb-16">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTo5NFhR7PXEhqFtG9JGZAl5GG6JZS7RKntaVRJqUXby7SKYIrh649AY9ocZoPVyQrBI_0&usqp=CAU"
            alt="Our Mission"
            className="rounded-xl w-[80%] shadow-lg"
          />
          <div>
            <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
            <p className="text-gray-600 leading-relaxed">
              AgCell exists to make buying a phone straightforward. We stock
              current smartphones, clear storage and RAM options, and the
              accessories that belong with them — with support when the order
              needs a human.
            </p>
          </div>
        </div>

        {/* Our Story */}
        <div className="grid md:grid-cols-2 gap-8 items-center mb-16">
          <div>
            <h2 className="text-2xl font-semibold mb-4">Our Journey</h2>
            <p className="text-gray-600 leading-relaxed">
              AgCell started as a local phone counter and grew into an online
              store. The catalog now covers flagship phones, everyday devices,
              and the cases, chargers, and audio gear that go with them.
            </p>
          </div>
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT-OJ9T0IhrzPMr8Ku8m1kNuXEFk10_EwiJcA&s"
            alt="Our Team"
            className="rounded-xl w-[90%] shadow-lg"
          />
        </div>

        {/* Values */}
        <div className="text-center mb-12">
          <h2 className="text-2xl font-semibold mb-6">What We Stand For</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 text-left">
            <div className="p-6 bg-gray-100 rounded-lg shadow">
              <h3 className="font-semibold text-lg mb-2">Customer First</h3>
              <p className="text-sm text-gray-600">
                We build everything with the customer in mind. Their
                satisfaction is our success.
              </p>
            </div>
            <div className="p-6 bg-gray-100 rounded-lg shadow">
              <h3 className="font-semibold text-lg mb-2">Integrity</h3>
              <p className="text-sm text-gray-600">
                Honesty and transparency are at the core of everything we do.
              </p>
            </div>
            <div className="p-6 bg-gray-100 rounded-lg shadow">
              <h3 className="font-semibold text-lg mb-2">Innovation</h3>
              <p className="text-sm text-gray-600">
                We embrace technology and creativity to deliver a better
                experience every day.
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-20">
          <h2 className="text-2xl font-semibold mb-4">Want to connect?</h2>
          <p className="text-gray-600 mb-6">
            Join us on our journey — follow us on social media or contact us
            directly.
          </p>
          <a
            href="/contactus"
            className="inline-block px-6 py-3 bg-primary text-white rounded-lg shadow hover:bg-red-700 transition"
          >
            Contact Us
          </a>
        </div>
      </div>
    </section>
  );
}
