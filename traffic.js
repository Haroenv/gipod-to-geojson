'use strict';
const got = require('got');

const args = process.argv.slice(2);
const url = 'http://gipod.api.agiv.be/ws/v1/';

const options = {
  '--type':'type',
  '--query':'quiets',
  '-h':
`
usage: node traffic.js [flag] [value]
flags:
  --type
    workassignment
    referencedata
    manifestation
    see <http://gipod.api.agiv.be/#!docs/technical.md> for reference
  --query
    a valid querystring
    see <http://gipod.api.agiv.be/#!docs/technical.md> for reference

example: node traffic.js --type workassignment --query city=gent&enddate=2016-03-20
`
}

for (let i in args) {
  if (args[i] in options) {
    let arg = args[i]
    console.log(options[arg]);
  }
}

let output = {
  'type': 'FeatureCollection',
  'features': ''
};

got(url)
  .then(response => {
    let parsed = response.body.replace(/"coordinate"/g,'"geometry"');
    parsed = JSON.parse(parsed);
    let features = [];
    for (let i in parsed) {
      if (parsed.hasOwnProperty(i)) {
        let feat = {};
        feat.geometry = parsed[i].geometry;
        feat.type = 'Feature';
        feat.properties = {
          'description':parsed[i].description,
          'detail':parsed[i].detail
        };
        features.push(feat);
      }
    }
    output.features = features;
    console.log(JSON.stringify(output));
  })
  .catch(error => {
    console.log(error.response.body);
  });

