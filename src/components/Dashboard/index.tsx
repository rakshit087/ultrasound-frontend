import dynamic from "next/dynamic";
import Head from "next/head";
import type { FC } from "react";
import { useEffect, useState } from "react";
import { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useBaseFeePerGas } from "../../api/base-fee-per-gas";
import colors from "../../colors";
import * as FeatureFlags from "../../feature-flags";
import { FeatureFlagsContext } from "../../feature-flags";
import * as Format from "../../format";
import useAuthFromSection from "../../hooks/use-auth-from-section";
import { useTwitterAuthStatus } from "../../hooks/use-twitter-auth";
import BasicErrorBoundary from "../BasicErrorBoundary";
import PoapSection from "../FamPage/PoapSection";
import HeaderGlow from "../HeaderGlow";
import FaqBlock from "../Landing/faq";
import MainTitle from "../MainTitle";
import TopBar from "../TopBar";
import ContactSection from "./ContactSection";
import FamSection from "./FamSection";
import JoinDiscordSection from "./JoinDiscordSection";
import SupplySection from "./SupplySection";

const AdminTools = dynamic(() => import("../AdminTools"), { ssr: false });
// We get hydration errors in production.
// It's hard to tell what component causes them due to minification.
// We stop SSR on all components, and slowly turn them back on one-by-one to see which cause hydration issues.
// On: MergeSection, JoinDiscordSection
// Off: SupplySection, BurnSection, MonetaryPremiumSection, FamSection, TotalValueSecuredSection.
const TotalValueSecuredSection = dynamic(
  () => import("./TotalValueSecuredSection"),
  { ssr: false },
);
const MonetaryPremiumSection = dynamic(
  () => import("./MonetaryPremiumSection"),
  { ssr: false },
);
const SupplyProjectionsSection = dynamic(
  () => import("./SupplyProjectionsSection"),
  { ssr: false },
);
const GasSection = dynamic(() => import("./GasSection"), {
  ssr: false,
});
// Likely culprit.
const BurnSection = dynamic(() => import("./BurnSection"), {
  ssr: false,
});

const useGasTitle = (defaultTitle: string) => {
  const [gasTitle, setGasTitle] = useState<string>();
  const baseFeePerGas = useBaseFeePerGas();

  useEffect(() => {
    if (typeof window === "undefined" || baseFeePerGas === undefined) {
      return undefined;
    }
    const gasFormatted = Format.gweiFromWei(baseFeePerGas.wei).toFixed(0);
    const newTitle = `${gasFormatted} Gwei | ${defaultTitle}`;
    setGasTitle(newTitle);
  }, [baseFeePerGas, defaultTitle]);

  return gasTitle;
};

// By default a browser doesn't scroll to a section with a given ID matching the # in the URL.
const useScrollOnLoad = () => {
  const [authFromSection, setAuthFromSection] = useAuthFromSection();

  useEffect(() => {
    if (typeof window === undefined || typeof document === undefined) {
      return undefined;
    }

    if (authFromSection !== "empty") {
      document
        .querySelector(`#${authFromSection}`)
        ?.scrollIntoView({ behavior: "auto", block: "start" });
      setAuthFromSection("empty");
    }

    if (window.location.hash.length > 0) {
      document
        .querySelector(window.location.hash)
        ?.scrollIntoView({ behavior: "auto", block: "start" });
    }
    // The useAuthFromSection deps are missing intentionally here, we only want
    // this to run once on load. Because we disable the exhaustive deps linting
    // rule for this reason do check anything you add above doesn't need to be
    // in there.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};

// This is a component to avoid triggering a render on the whole Dashboard.
const GasTitle = () => {
  const gasTitle = useGasTitle("dashboard | ultrasound.money");
  return (
    <Head>
      <title>{gasTitle}</title>
    </Head>
  );
};

const Dashboard: FC = () => {
  const { featureFlags, setFlag } = FeatureFlags.useFeatureFlags();
  const [twitterAuthStatus, setTwitterAuthStatus] = useTwitterAuthStatus();
  useScrollOnLoad();

  return (
    <FeatureFlagsContext.Provider value={featureFlags}>
      <SkeletonTheme
        baseColor={colors.slateus500}
        highlightColor="#565b7f"
        enableAnimation={true}
      >
        <GasTitle />
        <HeaderGlow />
        <div className="container mx-auto">
          <BasicErrorBoundary>
            <AdminTools setFlag={setFlag} />
          </BasicErrorBoundary>
          <div className="px-4 md:px-16">
            <BasicErrorBoundary>
              <TopBar />
            </BasicErrorBoundary>
          </div>
          <MainTitle>ultra sound money</MainTitle>
          <SupplySection />
          <GasSection />
          <SupplyProjectionsSection />
          <div className="h-16"></div>
          <BurnSection />
          <div className="h-16"></div>
          <TotalValueSecuredSection />
          <div className="h-16"></div>
          <MonetaryPremiumSection />
          <FamSection />
          <PoapSection
            setTwitterAuthStatus={setTwitterAuthStatus}
            twitterAuthStatus={twitterAuthStatus}
          />
          <JoinDiscordSection
            setTwitterAuthStatus={setTwitterAuthStatus}
            twitterAuthStatus={twitterAuthStatus}
          />
          <div className="mt-32 flex px-4 md:px-0">
            <div className="relative w-full md:m-auto lg:w-2/3">
              <FaqBlock />
            </div>
          </div>
          <ContactSection />
        </div>
      </SkeletonTheme>
    </FeatureFlagsContext.Provider>
  );
};

export default Dashboard;
