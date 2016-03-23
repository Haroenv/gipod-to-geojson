'use strict';
const got = require('got');

const args = process.argv.slice(2);
const address = 'http://gipod.api.agiv.be/ws/v1/';

let type = '', query = '';

const options = {
  '--type': (typeArg)=>{
    type = typeArg;
  },
  '--query': (queryArg)=>{
    query = '?'+queryArg;
  },
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
    // if (args[parseInt(i)+1] === 'undefined') {
    //   options['-h'];
    // } else {
      let arg = args[i];
      options[arg](args[parseInt(i)+1]);
    // }
  }
}

const url = address + type + query;

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

