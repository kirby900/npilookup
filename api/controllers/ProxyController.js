/**
 * ProxyController
 *
 * @description :: Server-side logic for managing proxies
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var request = require('request');

module.exports = {

	LookupByNPI: function (req, res) {
	    //return res.send("Hi there!");
	    var npi = req.query.npi;

		request.get({
        	url: "https://npiregistry.cms.hhs.gov/api/?number=" + npi
	    }, function(error, response, body) {
    	    if (error) {
        	    sails.log.error(error);
        	    return;
        	}

    	    //sails.log.info(response);
    	    //sails.log.info(body);
    	    //return res.json(body);
    	    return res.send(body);
    	});
  	}

};

