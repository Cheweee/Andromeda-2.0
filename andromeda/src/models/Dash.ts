import { TooltipPayload } from "recharts";

export interface DistributionExtendedTooltipPayload extends TooltipPayload {
    payload: DistributionBarChartData;
}

export class DistributionBarChartData {
    id?: number;
    lecturer: string;
    laboratories?: number;
    lections?: number;
    practicals?: number;
    summary: number;
    editable?: boolean;
}