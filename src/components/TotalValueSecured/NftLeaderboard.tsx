import { useTotalValueSecured } from "../../api/total-value-secured";
import { AmountBillionsUsdAnimated } from "../Amount";
import BodyText from "../TextsNext/BodyText";
import { WidgetBackground, WidgetTitle } from "../WidgetSubcomponents";

const NftLeaderboard = () => {
  const totalValueSecured = useTotalValueSecured();
  return (
    <WidgetBackground>
      <WidgetTitle>nft leaderboard</WidgetTitle>
      <ul className="max-h-32 overflow-y-auto">
        {totalValueSecured !== undefined &&
          totalValueSecured.nftLeaderboard.map((row) => (
            <li
              className="text-white w-12 flex justify-between truncate"
              key={row.name}
            >
              <BodyText>{row.name}</BodyText>
              <AmountBillionsUsdAnimated>
                {row.marketCap}
              </AmountBillionsUsdAnimated>
            </li>
          ))}
      </ul>
    </WidgetBackground>
  );
};

export default NftLeaderboard;
