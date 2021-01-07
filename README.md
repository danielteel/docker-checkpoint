# docker-checkpoint


git clone this bad johnny and then execute a docker-compose up, and then visit localhost:3001/emails.


API

GET - /emails/
     Returns all the emails
     
GET - /emails/:id
     Returns the email with the id :id

GET - /search?query=WhatToSearchForHere
     Returns emails that have WhatToSearchForHere in the subject
     
POST - /send
     Sends an email. Body object is expected to look like 
     {
        sender:"sendersEmail@email.com"
        recipient:"recipientsEmail@email.com"
        subject:"HOT HOT FIRE"
        message:"hey craig, this is jenny from accounting, the building is on fire so try and leave if you can."
     }
