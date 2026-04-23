import { Activity, Clock, Droplets, Trophy } from "lucide-react";
import type { RunDto } from "#/client/types.gen";
import { Card, CardContent } from "#/components/ui/card";
import { formatRate, formatVolume } from "#/lib/formatters";

type ProfileStats = {
  bestRun: RunDto | undefined;
  totalLiters: number;
  averageRate: number;
  totalRuns: number;
};

export function computeProfileStats(runs: RunDto[]): ProfileStats {
  const withRate = runs.filter((r) => typeof r.rate === "number");

  const bestRun = withRate.reduce<RunDto | undefined>((best, run) => {
    if (!best) return run;
    return (run.rate ?? 0) > (best.rate ?? 0) ? run : best;
  }, undefined);

  const totalLiters = runs.reduce((sum, r) => sum + (r.volume ?? 0), 0);

  const averageRate =
    withRate.length > 0
      ? withRate.reduce((sum, r) => sum + (r.rate ?? 0), 0) / withRate.length
      : 0;

  return { bestRun, totalLiters, averageRate, totalRuns: runs.length };
}

export function ProfileStats({ runs }: { runs: RunDto[] }) {
  const { bestRun, totalLiters, averageRate, totalRuns } =
    computeProfileStats(runs);

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <Card className="rounded-2xl">
        <CardContent className="pt-2">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Runs</p>
              <p className="mt-1 text-3xl font-black tracking-tight">
                {totalRuns}
              </p>
            </div>
            <div className="rounded-xl bg-primary/10 p-2.5">
              <Activity className="size-5 text-primary" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl">
        <CardContent className="pt-2">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Best Rate</p>
              <p className="mt-1 text-3xl font-black tracking-tight text-primary">
                {bestRun ? formatRate(bestRun.rate) : "—"}
              </p>
            </div>
            <div
              className="rounded-xl p-2.5"
              style={{
                backgroundColor:
                  "color-mix(in oklch, var(--highlight) 15%, transparent)",
              }}
            >
              <Trophy
                className="size-5"
                style={{ color: "var(--highlight)" }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl">
        <CardContent className="pt-2">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Liters</p>
              <p className="mt-1 text-3xl font-black tracking-tight">
                {formatVolume(totalLiters)}
              </p>
            </div>
            <div className="rounded-xl bg-blue-500/10 p-2.5">
              <Droplets className="size-5 text-blue-500" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl">
        <CardContent className="pt-2">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Avg. Rate</p>
              <p className="mt-1 text-3xl font-black tracking-tight">
                {totalRuns > 0 ? formatRate(averageRate) : "—"}
              </p>
            </div>
            <div className="rounded-xl bg-muted p-2.5">
              <Clock className="size-5 text-muted-foreground" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
