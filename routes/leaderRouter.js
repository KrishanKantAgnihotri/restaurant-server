const express = require("express");
const bodyParser = require("body-parser");

const leaderRouter = express.Router();
leaderRouter.use(bodyParser.json());
leaderRouter.route('/')
    .all((req, res, next) => {
        res.stausCode = 200;
        res.setHeader("Content-Type", "text/plain");
        next();
    })
    .get((req, res, next) => {
        res.end("Will send all the leaders to you!!");
    })
    .post((req, res, next) => {
        res.end("Will add the leader: " + req.body.name + "with details: " + req.body.description);
    })
    .put((req, res, next) => {
        res.statusCode = 403;
        res.end("Put operation not supported on /leaders");
    })
    .delete((req, res, next) => {
        res.end("Deleting all the  leaders");
    });
leaderRouter.route("/:leadId")
    .all((req, res, next) => {
        res.stausCode = 200;
        res.setHeader("Content-Type", "text/plain");
        next();
    })
    .get((req, res, next) => {
        res.end("Will send the leader: " + req.params.leadId + " to you ");
    })
    .post((req, res, next) => {
        res.statusCode = 403;
        res.end("Post operation not supported on /leaders/" + req.params.leadId);
    })
    .put((req, res, next) => {
        res.write("Updating the leader:" + req.params.leadId + "\n");
        res.end("Will update the leader: " + req.body.name + "with details: " + req.body.description);
    })
    .delete((req, res, next) => {
        res.end("Deleting leader: " + req.params.leadId);
    });
module.exports = leaderRouter;