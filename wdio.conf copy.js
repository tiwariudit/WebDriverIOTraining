import { ReportAggregator, HtmlReporter } from 'wdio-html-nice-reporter';
let reportAggregator;

export const config = {
    //
    // ====================
    // Runner Configuration
    // ====================
    runner: 'local',

    //
    // ==================
    // Specify Test Files
    // ==================
    specs: [
        './test/specs/test.e2e.js',
        './test/specs/test.e2e1.js',
        './test/specs/test.e2e2.js'
    ],

    //
    // ============
    // Capabilities
    // ============
    maxInstances: 10,
    // capabilities: [
    //     {
    //         browserName: 'chrome',
    //     }
    // ],
    capabilities: [
    {
      browserName: 'chrome',
      //maxInstances: 2, // per browser
      acceptInsecureCerts: true
    },
    // {
    //   browserName: 'firefox',
    //   //maxInstances: 1,
    //   acceptInsecureCerts: true
    // }
  ],

    //
    // ===================
    // Test Configurations
    // ===================
    logLevel: 'info',
    bail: 0,
    baseUrl: 'http://localhost',
    waitforTimeout: 10000,
    connectionRetryTimeout: 120000,
    connectionRetryCount: 3,

    //
    // ====================
    // Framework and Reporters
    // ====================
    framework: 'mocha',

    reporters: [
        'spec',
        ['html-nice', {
            outputDir: './reports/html-reports/',
            filename: 'report.html',
            reportTitle: 'Test Report',
            linkScreenshots: true,
            showInBrowser: false,
            collapseTests: false,
            useOnAfterCommandForScreenshot: false
        }]
    ],

    mochaOpts: {
        ui: 'bdd',
        timeout: 60000
    },

    //
    // ====================
    // Hooks
    // ====================

    /**
     * Runs before test execution starts
     */
    onPrepare: function (config, capabilities) {
        // ✅ Initialize the report aggregator
        reportAggregator = new ReportAggregator({
            outputDir: './reports/html-reports/',
            filename: 'master-report.html',
            reportTitle: 'Master Report',
            browserName: 'chrome',
            collapseTests: true
        });
        // Clean old reports
        reportAggregator.clean();
    },

    /**
     * Runs after all workers have shut down and the process is about to exit
     */
    onComplete: async function (exitCode, config, capabilities, results) {
        // ✅ Generate the final HTML report
        await reportAggregator.createReport();
    },

    afterTest: async function (test, context, { error, passed }) {
        // Always take a screenshot after each test
        let filepath = './reports/html-reports/screenshots/' + Date.now() + '.png';
	await browser.saveScreenshot(filepath);
	process.emit('test:screenshot', filepath);
        //await browser.takeScreenshot();
    }
};
