import Button from "../../components/Button/Button";

function NotFound() {
  return (
    <main className="grid min-h-[100vh] place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8">
      <div className="text-center">
        <p className="text-[35px] font-rubik-moonrock tracking-[5px] font-semibold text-reddish">
          404
        </p>
        <h1 className="text-[50px] uppercase font-bold font-rubik-moonrock tracking-[5px] text-primary-main sm:text-5xl">
          Page not found
        </h1>
        <p className="mt-1 font-rubik-moonrock leading-7 text-reddish">
          Sorry, we couldn’t find the page you’re looking for.
        </p>
        <div className="mt-5 flex items-center justify-center gap-x-6">
          <Button text="Go Back Home" link="/" />
        </div>
      </div>
    </main>
  );
}

export default NotFound;
