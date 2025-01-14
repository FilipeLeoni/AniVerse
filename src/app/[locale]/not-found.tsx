import Button from "@/components/shared/Button";
import Section from "@/components/shared/Section";
import Link from "next/link";

function NotFound() {
  return (
    <div className="relative w-full min-h-screen flex items-center">
      {/* <Head title={`${t("error_title")} - Kaguya`} /> */}

      <div className="fixed z-0 w-full h-full flex items-center justify-center">
        <h1 className="font-bold text-[30vw] text-gray-500">404</h1>

        <div className="absolute inset-0 bg-black/90 w-full h-full"></div>
      </div>

      <Section className="relative z-10 flex flex-col items-center w-full h-full text-center ">
        <div className="mb-4 text-gray-300">
          <span className="text-lg">
            <div>
              <span className="text-red-300">Error 404</span>
            </div>
          </span>
        </div>

        <p className="text-4xl font-semibold">There&apos;s nothing here...</p>

        <p className="text-2xl text-gray-200 mt-4">
          ...maybe the page you&apos;re looking for is not found or never
          existed.
        </p>

        <Link
          href="/"
          className="bg-transparent mt-8 border-2 border-red-500 rounded hover:bg-red-500 text-white transition-colors px-3 py-2"
        >
          <p className="text-lg">Go back</p>
        </Link>
      </Section>
    </div>
  );
}

export default NotFound;
