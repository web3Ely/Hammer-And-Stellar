# Hammer-And-Stellar(Brochure)

Welcome to Hammer & Stellar, where we build your celestial vessels beyond imagination (We have recently relocated to the R43-L region due to an ongoing regional conflict at our previous location). 

While our shipyard is in the midst of construction, certain services may not yet be accessible to the public. But we assure you that we will reintroduce them as our shipyard's construction progresses. Nonetheless, we remain eager to assist you to the fullest extent possible!

## Services

At H&S, ensuring customer satisfaction remains our foremost priority, and our commitment to delivering the best services in spacecraft construction spans across the cosmos. 

Currently, we only offer two services:
- ***Ship flooring*** --- it is a service that builds the base of your dream spaceship
- ***Ship engine*** --- it is a service that attaches the engine of your choice to your dream spaceship
- _Other services are coming soon_

## Registration

Whether you're a fresh-faced rookie just clutching that shiny new spaceship license or a seasoned space warrior who survived countless space battles, the yearning for that perfect spacecraft is universal. And you will find the step-by-step guide below to make that dream of yours a glorious reality.

Once you arrive at Hammer & Stellar shipyard, please proceed to our front desk:
```
const shipyard = require("./arrivedAtHSShipyard");
const frontdesk = shipyard.frontdesk();
```
When you meet with our welcoming receptionist, they'll gladly offer you a registration form. We kindly request that you complete this form before our dedicated staff member proceeds to assist you with your request.
```
const registrationForm = frontdesk();
```
An important point to bear in mind is that our front desk is currently staffed by a basic robot. It has very limited interaction capabilities. While you can communicate with it, its responses are confined to "Yes" or "No" answers.
```
frontdesk("hi") // it replies 'Yes'
frontdesk(1)    // it replies 'No'
```
We completely understand how frustrating it can be to receive responses limited to only 2 answers. We're leaving no stone unturned in our quest to recruit top-tier talent. Regrettably, the prevailing conflicts of our times have discouraged many from venturing into the cosmos.

The registration form only has four fields: ***your name, your desired spaceship size, and payment method***. Upon completing the form, please kindly submit it to our front desk staff.
```
const form = registrationForm("Mr. Aha", "regular", "nebula coin");
const specialists = frontdesk(form);
```
Congratulations! Your registration process is now complete, and our team of specialists is there to offer their expertise alongside our exceptional services.

## Specialist 
### Bob the floor guy
