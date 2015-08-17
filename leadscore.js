'use strict';
var Client   = require('clearbit').Client,
    extend = require('extend'),
    q = require('q'),
    clearbit =  null;


module.exports = function (key) {
  clearbit = new Client({key: key});
  return {
      lookup : function(email, options) {
        var deferred = q.defer();

        clearbit.Person.find({email: email})
        .then(function (person) {
            var result = getScore(person, options);
            deferred.resolve(result); 
        })
        .catch(function (err) {
            deferred.resolve(0,null);//an error occured, return zero
        });  

        return deferred.promise;
    }
  };
};

var defaults = {
        twitter_followers_weight:   0.09,
        angellist_followers_weight: 0.05,
        klout_score_weight:         0.05,
        company_twitter_followers_weight: 0.05,
        company_alexa_rank_weight:  0.000005,
        company_google_rank_weight: 0.05,
        company_employees_weight:   0.5,
        company_raised_weight:      0.00005,
        company_score:              10,
        total_score:                1415
      };

function getScore(person,options) {
    
    options = extend(options,defaults);
    
    var score = 0.0;
    
    if(person.avatar){
        score += 5;
    }

    if(person.twitter.followers) {
        score += person.twitter.followers * options.twitter_followers_weight;
    }

    if(person.angellist.followers) {
        score += person.angellist.followers * options.angellist_followers_weight;
    }

    if(person.klout.score) {
        score += person.klout.score * options.klout_score_weight;
    }

    var company = person.company
    if(company) {
      if(!company.personal){
        score += options.company_score;
      }

      if(company.raised) {
        score += company.raised *
                  options.company_raised_weight;
      }

      if(company.employees) {
        score += company.employees *
                  options.company_employees_weight;
      }

      if(company.alexa.globalRank) {
        score += 1 / (company.alexa.globalRank *
                  options.company_alexa_rank_weight);
      }

      if(company.google.rank && company.google.rank > 0) {
        score += 1 / (company.google.rank *
                  options.company_google_rank_weight);
      }

      if(company.twitter.followers) {
        score += company.twitter.followers *
                  options.company_twitter_followers_weight;
      }
    }

    score /= options.total_score;
    
    person.leadScore = score.toFixed(2);//round to 1 dp

    return person;
}