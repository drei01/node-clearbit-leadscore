# Node LeadScore
A Node implementation of https://github.com/clearbit/clearbit-leadscore. 
This library calculates a 'lead score', a simple score which gives you some indication that an email address is either associated with an influential individual, or a high profile company.

##Getting Started

Install using npm.

```
npm install node-leadscore --save
```

Include the library.

```
var leadscore = require('node-leadscore')('YOUR_CLEARBIT_API_KEY');
```
##Method: lookup(email, options)
Returns full Person object (see https://clearbit.com/docs#person-api) plus leadScore as *person.leadScore*.

Passing in options is not required (email address is required).

```
{
  twitter_followers_weight:   0.05,
  angellist_followers_weight: 0.05,
  klout_score_weight:         0.05,
  company_twitter_followers_weight: 0.05,
  company_alexa_rank_weight:  0.000005,
  company_google_rank_weight: 0.05,
  company_employees_weight:   0.5,
  company_raised_weight:      0.0000005,
  company_score:              10,
  total_score:                1415
}
```
####Example
```
var leadscore = require('node-leadscore')('YOUR_CLEARBIT_API_KEY');

leadscore.lookup('email@address.com').then(function(person){
    if(person.leadScore > 0.5){
        //baller!
    }
});
```