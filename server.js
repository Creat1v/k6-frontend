const express = require('express');
const app = express();
const { exec } = require('child_process');
const path = require('path');

app.use(express.static('public'));
app.use(express.json());
// Serve static files from the directory where k6 generates the report
app.use('/reports', express.static('/usr/src/app/reports'));

/**
 * Executes a k6 test with the given target URL and options.
 * @param {string} target - The target URL for the k6 test.
 * @param {Object} options - The options for the k6 test, including vus and duration.
 * @param {Function} callback - A callback function to handle the result or error.
 */
function executeK6Test(target, options, callback) {
    // Construct the k6 script
    const k6Script = `import http from "k6/http"; export default function() { http.get("${target}"); }`;

    // Construct the command to execute the k6 script using echo and pipe it to k6 run
    //const command = `echo '${k6Script}' | k6 run --vus ${options.vus} --duration ${options.duration} --out json=test_results.json -`;
    const command = `echo '${k6Script}' | /usr/local/bin/k6 run --vus ${options.vus} --duration ${options.duration} --out dashboard=export=/usr/src/app/reports/html-report.html -`;
    // const command2 = `echo "TEST" > /usr/src/app/reports/test.txt`;
    // Execute the k6 command
    exec(command, { shell: '/bin/bash' }, callback);
    // exec(command2, { shell: '/bin/bash' }, callback);
}

// Optional: Specific route to directly access the HTML report
app.get('/html-report', (req, res) => {
    res.sendFile(path.join('/usr/src/app/reports/html-report.html'));
  });

  app.post('/execute-test', (req, res) => {
    const { target, vus, duration } = req.body;

    if (!target || target.trim() === '') {
        return res.status(400).send({ message: 'Target URL is required and cannot be empty' });
    }

    const options = {
        vus: vus || 1, // Default to 1 VU if not specified
        duration: duration || '10s' // Default to 1 minute if not specified
    };

    executeK6Test(target, options, (error, stdout, stderr) => {
        if (error) {
            // Ensure no response has been sent before
            if (!res.headersSent) {
                return res.status(500).send({ message: 'Error executing k6 test', error: stderr });
            }
        } else {
            // Ensure no response has been sent before
            if (!res.headersSent) {
                res.send({ message: 'k6 test executed successfully', result: stdout });
            }
        }
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});