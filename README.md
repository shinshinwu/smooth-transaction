#Smooth Core Goals

##What’s important for a positive working environment?

- transparency
- use slack to communicate when necessary
- standup three times a day (morning, lunch, dinner)
- mixing in pairing with solo time
- pomodoro maybe? up to individual
- timeboxing tasks

###Hours:
- this week, core hours, try to leave by 10pm
- sat: start at 11
- sun: normal schedule
- mon-wed: crunch time

##What do we want to get technically from this?

- learn payment systems and data-security (encryption)
- data analysis (data visualization, D3)
- full JS stack (rails api backup plan)
- mongo database
- testing in JS (Jasmine, etc)
- CSS frameworks, and responsiveness (PureCSS, SkeletonCSS, etc)
- Agile development

##A non-profit website can...

- sign up for an account
- add a widget to their site for the transactions
- view the history of activity
- sweet visuals!

## A donator can...

- use the widget to make a donation
- donate with a credit card/debit card (stripe)
- donate with a checking account (dwolla)
- donate without an account
- sign up for an account for reciepts and recurring payments

##Things to make

- Widget
- Website
- homepage (login/signup)
- dashboard (view activity)

##Order of tasks to complete

- wireframes
- dashboard design
- what do we want to present?
- utilize stripe/dwolla APIs
- database design
- what info do we want to capture and manage?
- widget design
- how can an organization "easily" use a widget (iframes)
- security

##Git Workflow and Best Practices

- branches for features
- delete the branch after it has been merged
- good comments in code for readability
- professional commit messages
- Initial User Stories

##Kickoff Tasks (What we need to research)
- which payment APIs to consume
- how to use the APIs
- iframes
- how can we use JS with iframes
- what's required for an organization to sign up
- we want to make it as easy as possible for them to sign up with payment companies
- D3 visualization
- Jasmine for testing

##Add on features
- Email receipts to donators with thank you notes (https://support.stripe.com/questions/does-stripe-offer-email-receipts, https://github.com/boucher/stripe-webhook-mailer)

##Data to retrieve

### Customers:
- Type of card (pie chart for visa, master, american express, discover, misc) (stripe) YES
- Donation occur time (scatterplot? bar chart?)
- Location distribution (US geomap) (stripe) YES

### Org:
- Earning trend over time (line chart)
- Total accumulated earning (own database)
- Total number of donations received (own database)
- Earning this month (stripe) YES
- Earning today (stripe) YES
- Top earning month (own database)
- Top earning day (own database)
- Current Balance to be deposited (Stripe) YES

###Org Schema:
- Total accumulated earning (updated with each transaction)
- Total number of donation (updated with each transaction)
- Top earning month (evaluated every month and overwrite if current amount is larger than record)
- Top earning day (evaluated every day and overwrite if current amount is larger than record)

