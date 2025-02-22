import { formatInTimeZone } from "date-fns-tz";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import highchartsAnnotations from "highcharts/modules/annotations";
import _merge from "lodash/merge";
import type { FC } from "react";
import { useEffect } from "react";
import { useMemo } from "react";
import colors from "../colors";
import type { Gwei } from "../eth-units";
import type { TimeFrameNext } from "../time-frames";
import type { BaseFeePoint } from "./Dashboard/GasSection";
import LabelText from "./TextsNext/LabelText";
import TimeFrameIndicator from "./TimeFrameIndicator";
import WidgetErrorBoundary from "./WidgetErrorBoundary";
import { WidgetBackground } from "./WidgetSubcomponents";

// Somehow resolves an error thrown by the annotation lib
if (typeof window !== "undefined") {
  // Initialize highchats annotations module (only on browser, doesn't work on server)
  highchartsAnnotations(Highcharts);
}

const baseOptions: Highcharts.Options = {
  accessibility: { enabled: false },
  chart: {
    zooming: {
      type: "x",
      resetButton: {
        position: {
          x: 0,
          y: 10,
        },
        theme: {
          fill: colors.slateus600,
          style: {
            opacity: 0.8,
            fontSize: "12",
            fontFamily: "Inter",
            fontWeight: "300",
            color: colors.white,
            textTransform: "lowercase",
            border: `1px solid ${colors.slateus400}`,
          },
          r: 4,
          zIndex: 20,
          states: { hover: { fill: "#343C56" } },
        },
      },
    },
    backgroundColor: "transparent",
    showAxes: false,
    marginRight: 80,
    marginLeft: 40,
    marginTop: 14,
  },
  title: undefined,
  xAxis: {
    type: "datetime",
    lineWidth: 0,
    labels: { enabled: false, style: { color: colors.slateus400 } },
    tickWidth: 0,
  },
  yAxis: {
    endOnTick: false,
    gridLineWidth: 0,
    labels: {
      style: { color: colors.slateus400, fontFamily: "Roboto Mono" },
    },
    title: undefined,
  },
  legend: {
    enabled: false,
  },
  tooltip: {
    backgroundColor: "transparent",
    borderWidth: 0,
    shadow: false,
    useHTML: true,
  },
  credits: { enabled: false },
  plotOptions: {
    series: {
      marker: {
        enabled: true,
        lineColor: "white",
        radius: 0.5,
        symbol: "circle",
      },
    },
  },
};

const makeBarrier = (barrier: number) => ({
  id: "barrier-plotline",
  color: colors.slateus500,
  width: 1,
  value: barrier,
  zIndex: 10,
  label: {
    x: 76,
    text: `${barrier?.toFixed(2)} Gwei 🦇🔊`,
    useHTML: true,
    align: "right",
    formatter: () => `
      <div class="flex justify-end">
        <img
          class="w-4 h-4"
          src="/bat-own.svg"
        />
        <img
          class="w-4 h-4 ml-1"
          src="/speaker-own.svg"
        />
        <img
          class="w-4 h-4 ml-1"
          src="/barrier-own.svg"
        />
      </div>
      <div class="flex mt-0.5">
        <div class="font-roboto font-light text-white">
          ${barrier?.toFixed(1)}
        </div>
        <div class="font-roboto font-light text-slateus-400 ml-1">
          Gwei
        </div>
      </div>
    `,
  },
});

const getTooltipFormatter = (
  baseFeesMap: Record<number, number>,
): Highcharts.TooltipFormatterCallbackFunction =>
  function () {
    const x = typeof this.x === "number" ? this.x : undefined;
    if (x === undefined) {
      return undefined;
    }

    const total = baseFeesMap[x];
    if (total === undefined) {
      return undefined;
    }

    const dt = new Date(x);
    const formattedDate = formatInTimeZone(dt, "UTC", "MMM d, hh:mm:ssaa");

    return `
      <div class="font-roboto bg-slateus-700 p-4 rounded-lg border-2 border-slateus-200">
        <div class="text-blue-spindle">${formattedDate}</div>
        <div class="flex">
          <div class="text-white">${total.toFixed(2)}</div>
          <div class="font-roboto text-slateus-400 ml-1">Gwei</div>
        </div>
      </div>
    `;
  };

type Props = {
  barrier: Gwei | undefined;
  baseFeesMap: Record<number, number>;
  baseFeesSeries: BaseFeePoint[] | undefined;
  max: number | undefined;
  onClickTimeFrame: () => void;
  timeFrame: TimeFrameNext;
};

const BaseFeesWidget: FC<Props> = ({
  barrier,
  baseFeesMap,
  baseFeesSeries,
  max,
  onClickTimeFrame,
  timeFrame,
}) => {
  // Setting lang has to happen before any chart render.
  useEffect(() => {
    if (Highcharts) {
      Highcharts.setOptions({
        lang: {
          resetZoomTitle: undefined,
        },
      });
    }
  }, []);

  const options = useMemo((): Highcharts.Options => {
    const min = baseFeesSeries?.reduce(
      (min, point) => (point[1] < min ? point[1] : min),
      15,
    );

    return _merge({}, baseOptions, {
      yAxis: {
        id: "base-fees",
        min,
        plotLines: [barrier !== undefined ? makeBarrier(barrier) : undefined],
      },
      series: [
        {
          id: "base-fees-over-area",
          type: "areaspline",
          threshold: barrier,
          data: baseFeesSeries,
          color: "#E79800",
          negativeColor: colors.drop,
          lineWidth: 0,
          states: {
            hover: {
              lineWidthPlus: 0,
            },
          },
          negativeFillColor: {
            linearGradient: {
              x1: 0,
              y1: 0,
              x2: 0,
              y2: 1,
            },
            stops: [
              [0.2, "#5487F400"],
              [1, "#00FFFB10"],
            ],
          },
          fillColor: {
            linearGradient: {
              x1: 0,
              y1: 1,
              x2: 0,
              y2: 0,
            },
            stops: [
              [(barrier ?? 0) / (max ?? 1), "#EDDB3610"],
              [1, "#E7980050"],
            ],
          },
        },
      ],
      tooltip: {
        formatter: getTooltipFormatter(baseFeesMap),
      },
    } as Highcharts.Options);
  }, [max, barrier, baseFeesMap, baseFeesSeries]);

  return (
    <WidgetErrorBoundary title="base fees">
      <WidgetBackground className="relative flex h-[364px] w-full flex-col overflow-hidden">
        <div
          // will-change-transform is critical for mobile performance of rendering the chart overlayed on this element.
          className={`
            pointer-events-none absolute -top-40
            -right-0 h-full
            w-full
            opacity-[0.25]
            blur-[110px]
            will-change-transform
          `}
        >
          <div
            className={`
            pointer-events-none absolute bottom-[3.0rem]
            -right-[1.0rem] h-2/5 w-3/5
            rounded-[35%]
            bg-[#0037FA]
          `}
          ></div>
        </div>
        <div className="flex items-baseline justify-between">
          <LabelText className="flex min-h-[21px] items-center">
            base fees
          </LabelText>
          <TimeFrameIndicator
            timeFrame={timeFrame}
            onClickTimeFrame={onClickTimeFrame}
          />
        </div>
        <div
          // flex-grow fixes bug where highcharts doesn't take full width.
          className={`
            mt-4 flex h-full
            w-full select-none
            justify-center
            overflow-hidden
            [&>div]:flex-grow
          `}
        >
          {baseFeesSeries === undefined ? (
            <div className="flex h-full items-center justify-center">
              <LabelText color="text-slateus-300">
                {timeFrame} time frame not yet available
              </LabelText>
            </div>
          ) : (
            <HighchartsReact highcharts={Highcharts} options={options} />
          )}
        </div>
        <LabelText color="text-slateus-400 mt-2" className="text-right">
          live on <span className="text-slateus-200">ultrasound.money</span>
        </LabelText>
      </WidgetBackground>
    </WidgetErrorBoundary>
  );
};

export default BaseFeesWidget;
