import React, { useMemo } from "react";
import SourceEpisodeSelector, {
  SourceEpisodeSelectorProps,
} from "../SourceEpisodeSelector";
import locales from "@/locales.json";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import { useRouter } from "next/navigation";
import classNames from "classnames";
import { useLocale } from "next-intl";

const LocaleEpisodeSelector: React.FC<SourceEpisodeSelectorProps> = ({
  episodes,
  ...props
}) => {
  const router = useRouter();
  const locale = useLocale();
  const defaultTabIndex = useMemo(
    () => locales.findIndex(({ local }: any) => local === locale),
    [locale]
  );

  return (
    <React.Fragment>
      <Tabs
        defaultIndex={defaultTabIndex}
        selectedTabClassName="bg-white !text-black"
      >
        <TabList className="flex items-center justify-end gap-x-1">
          {locales.map(({ locale }) => {
            return (
              <Tab
                key={locale}
                className={classNames(
                  "px-3 py-2 rounded-[6px] cursor-pointer hover:bg-white hover:text-black transition duration-300"
                )}
              >
                {locale.toUpperCase()}
              </Tab>
            );
          })}
        </TabList>

        <div className="mt-4">
          {locales.map(({ locale }) => {
            const localeEpisodes = episodes?.filter((episode: any) =>
              episode?.source?.locales.some(
                (sourceLocale: any) => sourceLocale === locale
              )
            );

            return (
              <TabPanel key={locale}>
                {!localeEpisodes?.length ? (
                  <p className="text-center text-2xl">{"No Episodes"}</p>
                ) : (
                  <SourceEpisodeSelector
                    key={locale}
                    episodes={localeEpisodes}
                    {...props}
                  />
                )}
              </TabPanel>
            );
          })}
        </div>
      </Tabs>
    </React.Fragment>
  );
};

export default LocaleEpisodeSelector;
