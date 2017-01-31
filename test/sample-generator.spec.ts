const fs = require('fs');
const spawn = require('child_process').spawn;
const config = require('../resource/app/test/test.sample.json');

const target = 'tmp/docs/';

import {SampleFactory} from '../src/sample-generator';

// Cleanup first
spawn('rm', ['-rf', target]);

// Test logic
SampleFactory(config);