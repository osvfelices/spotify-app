import { getProviders, signIn } from "next-auth/react";
import Image from "next/image";
import spotify_logo from "../assets/spotify_logo.png";

function Login({ providers }) {
  if (providers == null) return <p>Loading...</p>;
  console.log(Object.values(providers));
  return (
    <div className="flex flex-col items-center bg-black min-h-screen w-full justify-center">
      <Image className="w-52 mb-5" src={spotify_logo} alt="" />

      {Object.values(providers).map((provider) => (
        <div key={provider.name}>
          <button
            className="bg-[#18D860] text-white p-5 rounded-full"
            onClick={() => signIn(provider.id, { callbackUrl: "/" })}
          >
            Login with {provider.name}{" "}
          </button>
        </div>
      ))}
    </div>
  );
}

export default Login;

export async function getServerSideProps() {
  const providers = await getProviders();

  return {
    props: {
      providers,
    },
  };
}
