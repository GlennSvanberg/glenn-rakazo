import { Trans } from "@lingui/react/macro";
import { Link, useNavigate } from "react-router-dom";
import { WindowChrome } from "./WindowChrome";

export function WelcomePage() {
  const navigate = useNavigate();
  return (
    <div className="flex min-h-full flex-col bg-background" data-rakazo-surface="welcome">
      <div className="app-drag flex gap-2 px-5 py-[18px]">
        <WindowChrome />
      </div>
      <main className="flex flex-1 flex-col items-center justify-center gap-11 px-5 pb-[90px]">
        {/* fiwe:welcome */}
        <div className="flex flex-col items-center gap-5">
          <img
            src="/brand/fiwe-wordmark-black.svg"
            alt=""
            className="h-9 w-auto dark:hidden sm:h-11"
          />
          <img
            src="/brand/fiwe-wordmark-vanilla.svg"
            alt=""
            className="hidden h-9 w-auto dark:block sm:h-11"
          />
          <h1 className="text-center text-[40px] font-bold leading-none tracking-[-0.03em] text-foreground sm:text-[56px]">
            FAIWE Agents
          </h1>
        </div>
        {/* /fiwe:welcome */}
        <p className="max-w-[600px] text-center text-[27px] leading-[1.4] text-foreground/75">
          <Trans>
            Your team of always-on agents
            <br />
            that you can give real work to.
          </Trans>
        </p>
        <div className="flex flex-wrap items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => navigate("/sign-up")}
            className="app-no-drag rounded-full bg-accent px-[34px] py-[15px] text-[19px] text-foreground transition hover:scale-[1.04] hover:bg-accent"
          >
            <Trans>Sign up</Trans>
            <span aria-hidden="true">&nbsp;&nbsp;→</span>
          </button>
          <Link
            to="/sign-in"
            className="app-no-drag rounded-full px-[34px] py-[15px] text-[19px] text-foreground/75 transition hover:text-foreground"
          >
            <Trans>Sign in</Trans>
          </Link>
        </div>
      </main>
    </div>
  );
}
