/*

  create and export configuration variables

*/

// container for all environments
var environments = {};

// staging environment (default)
environments.staging = {
  'port' : 3000,
  'envName' : 'staging'
};

// production environment
environments.production = {
  'port' : 5000,
  'envName' : 'production'
};

// determine which environment was passed as a command-line argument
var currentEnvironment = typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : '';

// check that current environment exists
var environmentToExport = typeof(environments[currentEnvironment]) == 'object' ? environments[currentEnvironment] : environments.staging;

// export module
module.exports = environmentToExport;