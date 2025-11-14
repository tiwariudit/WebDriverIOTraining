import { ReportAggregator, HtmlReporter } from 'wdio-html-nice-reporter';
import fs from 'fs';

let reportAggregator;

export const config = {

    runner: 'local',

    specs: [
        './test/specs/test.e2e.js',
        './test/specs/test.e2e1.js',
        './test/specs/test.e2e2.js'
    ],

    maxInstances: 5,

    capabilities: [
        {
            browserName: 'chrome',
            acceptInsecureCerts: true,
            'goog:chromeOptions': {
                args: [
                    '--headless=new',
                    '--no-sandbox',
                    '--disable-dev-shm-usage',
                    '--disable-gpu',
                    '--window-size=1920,1080'
                ]
            }
        }
    ],

    logLevel: 'info',

    bail: 0,
    baseUrl: 'http://localhost',
    waitforTimeout: 10000,
    connectionRetryTimeout: 120000,
    connectionRetryCount: 3,

    framework: 'mocha',

    reporters: [
        'spec',
        ['html-nice', {
            outputDir: './reports/html/',
            filename: 'report.html',
            reportTitle: 'WDIO Test Report',
            linkScreenshots: true,
            showInBrowser: false,
            collapseTests: false
        }]
    ],

    mochaOpts: {
        ui: 'bdd',
        timeout: 60000
    },

    //
    // Hooks
    //
    onPrepare: function (config, capabilities) {
        // Ensure screenshot directory exists
        if (!fs.existsSync('./reports/html/screenshots')) {
            fs.mkdirSync('./reports/html/screenshots', { recursive: true });
        }

        // Master report
        reportAggregator = new ReportAggregator({
            outputDir: './reports/html/',
            filename: 'master-report.html',
            reportTitle: 'Master Report',
            browserName: 'chrome',
            collapseTests: true
        });

        reportAggregator.clean();
    },

    onComplete: async function () {
        await reportAggregator.createReport();
    },

    afterTest: async function (test, context, { error, passed }) {
        // Always take screenshot
        const screenshotPath = `./reports/html/screenshots/${Date.now()}.png`;
        await browser.saveScreenshot(screenshotPath);

        // Required for html-nice reporter
        process.emit('test:screenshot', screenshotPath);
    }
};
