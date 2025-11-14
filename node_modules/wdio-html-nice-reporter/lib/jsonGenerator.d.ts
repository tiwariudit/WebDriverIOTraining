import { HtmlReporterOptions, ReportData } from "./types.js";
declare class JsonGenerator {
    private static LOG;
    static writeJson(jsonFile: string, stringified: string, reportOptions: HtmlReporterOptions, reportData: ReportData): void;
    static jsonOutput(reportOptions: HtmlReporterOptions, reportData: ReportData): Promise<void>;
}
export default JsonGenerator;
