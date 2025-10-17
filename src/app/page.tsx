import Link from "next/link";

export default function Home() {
  return (
    <div className="w-screen h-screen bg-black flex justify-center items-center">
      <div className="text-white w-full max-w-[600px] mx-auto">
        <h1 className="text-5xl mb-4">The best Journal app, Period.</h1>
        <p className="text-2xl mb-4">
          This is the best app for tracking your mood through out your life. All you have to do is to be honest.
        </p>
        <div>
          <Link href={"/journal"}>
            <button className="bg-blue-600 p-4 rounded-lg">Get Started</button>
          </Link>
        </div> 
      </div>
    </div>
  );
}
