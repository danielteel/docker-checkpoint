const express = require('express')
const app = express()
const port = 3001;
let knex=null;

let knexConnectionAttempt=0;
const knexConnectionAttemptMax=60;

knexTryConnect();

function knexTryConnect(){
    if (knexConnectionAttempt<=knexConnectionAttemptMax){
        knexConnectionAttempt++;
        try {
            console.log("Trying to connect...")

            knex = require('knex')(require('./knexfile.js').development);

            //Create scheme and seed data if table doesnt exist
            knex.schema.hasTable('emails').then(function(exists) {
                if (!exists){
                    return knex.migrate.latest().then( ()=>{
                        return knex.seed.run().then( ()=>{
                            console.log("Success, schema and seed file ran!")
                            knexDidConnect();
                        });
                    });
                }else{
                    console.log("Success!")
                    knexDidConnect();
                }
            }).catch( err => {
                console.log("Failed to connect, trying again in 1 second.")
                setTimeout(knexTryConnect, 1000);
            });

        }catch (err){
            console.log("Failed to connect, trying again in 1 second.")
            setTimeout(knexTryConnect, 1000);
        }
        
    }else{
        throw Error("Failed to connect, max attempts, not trying again.");
    }
}

function knexDidConnect(){


    app.use(express.json())

    app.get('/emails', (req, res) => {
        knex
            .select('*')
            .from('emails')
            .then(data => res.status(200).json(data))
            .catch(err =>
                res.status(404).json({
                    message:
                        'What you are looking for is not here Homie'
                }))
    });

    app.get('/emails/:id', (req, res) => {
        knex
            .select('*')
            .where("id", req.params.id)
            .from('emails')
            .then(data => res.status(200).json(data))
            .catch(err =>
                res.status(404).json({
                    message:
                        'What you are looking for is not here Homie'
                }))
    });


    app.get('/search',(req,res) => {
        knex
            .select('*')
            //.where("subject", req.params.subject)
            .where('subject', 'ilike', `%${req.query.query}%`)
            .from('emails')
            .then(data => res.status(200).json(data))
            .catch(err =>
                res.status(404).json({
                    message:
                        'What you are looking for is not here Homie'
                }))

    });

    app.post('/send',function(req,res){
        const email = req.body;
        if (email.sender && email.recipient && email.subject && email.message){
            knex('emails').insert(email).then( data =>{//We had to do the .then on the end, thats what actually gets the insert statement to execute.
                res.status(201).json(data); 
            }).catch( err => {
                res.status(400).json({
                    "status": "failed",
                    "message": err.message,
                    "body" : email
                });
            });
        }else{ 
            res.status(400).json({
                "status": "failed",
                "message": "The message was not sent because you obviously suck"
            });
        }
    });


    app.listen(port, () => console.log(`Email express API server listening at http://localhost:${port}`))

}