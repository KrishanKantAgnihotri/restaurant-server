const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const authenticate = require("../authenticate");
const cors = require("./cors")
const Favorites = require('../models/favorite');

const favoriteRouter = express.Router();

favoriteRouter.use(bodyParser.json());

favoriteRouter.route('/')
    .options ((req, res) => { res.sendStatus(200); })
    .get(authenticate.verifyUser, (req, res, next) => {
        Favorites.findOne({ user: req.user._id })
            .populate("user")
            .populate("dishes")
            .exec((err, favorites) => {
                if (err) return next(err);
                res.statusCode = 200;
                res.setHeader("Content-Type", "applicatioin/json");
                res.json(favorites);
            });
    })
    .post( authenticate.verifyUser, (req, res, next) => {
        Favorites.findOne({ user: req.user._id }, (err, favorite) => {
            if (err) return next(err);
            if (!favorite) {
                Favorites.create({ user: req.user._id })
                    .then((favorite) => {
                        for (var i = 0; i < req.body.length; i++)
                            if (favorite.dishes.indexOf(req.body[i]._id) < 0)
                                favorite.dishes.push(req.body[i]);
                        favorite.save()
                            .then((favorite) => {
                                Favorites.findById(favorite._id)
                                    .populate("user")
                                    .populate("dishes")
                                    .then((favorite) => {
                                        res.statusCode = 200;
                                        res.setHeader("Content-Type", "application/json");
                                        res.json(favorite);
                                    })

                            })
                            .catch((err) => {
                                return next(err);
                            });
                    })
                    .catch((err) => {
                        return next(err);
                    })

            }
            else {
                for (i = 0; i < req.body.length; i++) {
                    if (favorite.dishes.indexOf(req.body[i]._id) < 0)
                        favorite.dishes.push(req.body[i]);
                }
                favorite.save()
                    .then((favorite) => {
                        Favorites.findById(favorite._id)
                            .populate("user")
                            .populate("dishes")
                            .then((favorite) => {
                                res.statusCode = 200;
                                res.setHeader("Content-Type", "application/json");
                                res.json(favorite);
                            })

                    })
                    .catch((err) => {
                        return next(err);
                    });
            }
        })

    })
    .put(authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.setHeader("Content-Type", "text/plain");
        res.end('PUT operation not supported on /favorites');
    })
    .delete(authenticate.verifyUser, (req, res, next) => {
        Favorites.findOneAndRemove({ user: req.user._id }, (err, resp) => {
            if (err) return next(err);
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(resp);

        });
    });

favoriteRouter.route('/:dishId')
    .options((req, res) => { res.sendStatus(200); })
    .get( authenticate.verifyUser, (req, res, next) => {
        Favorites.findOne({ user: req.user._id })
            .then((favorites) => {
                if (!favorites) {
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "application/json");
                    return res.json({ "exists": false, "favorites": favorites });
                }
                else {
                    if (favorites.dishes.indexOf(req.params.dishId) < 0) {
                        res.statusCode = 200;
                        res.setHeader("Content-Type", "application/json");
                        return res.json({ "exists": false, "favorites": favorites });
                    }
                    else {
                        res.statusCode = 200;
                        res.setHeader("Content-Type", "application/json");
                        return res.json({ "exists": true, "favorites": favorites });

                    }
                }

            }, (err) => next(err))
            .catch((err) => next(err))

    })
    .post(authenticate.verifyUser, (req, res, next) => {
        Favorites.findOne({ user: req.user._id }, (err, favorite) => {
            if (err) return next(err);
            if (!favorite) {
                Favorites.create({ user: req.user._id })
                    .then((favorite) => {
                        favorite.dishes.push({ "_id": req.params.dishId });
                        favorite.save()
                            .then((favorite) => {
                                Favorites.findById(favorite._id)
                                    .populate("user")
                                    .populate("dishes")
                                    .then((favorite) => {
                                        res.statusCode = 200;
                                        res.setHeader("Content-Type", "application/json");
                                        res.json(favorite);
                                    })

                            })
                            .catch((err) => {
                                return next(err);
                            });
                    })
                    .catch((err) => {
                        return next(err);
                    })

            }
            else {
                if (favorite.dishes.indexOf(req.params.dishId) < 0) {
                    favorite.dishes.push(req.body)
                    favorite.save()
                        .then((favorite) => {
                            Favorites.findById(favorite._id)
                                .populate("user")
                                .populate("dishes")
                                .then((favorite) => {
                                    res.statusCode = 200;
                                    res.setHeader("Content-Type", "application/json");
                                    res.json(favorite);
                                })

                        })
                        .catch((err) => next(err))
                }
                else {
                    res.statusCode = 403;
                    res.setHeader("Content-Type", "text/plain");
                    res.end("Dish" + req.params.dishId + "already exists!!");
                }
            }
        });

    })
    .put(authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.setHeader("Content-Type", "text/plain");
        res.end('PUT operation not supported on /favorites/' + req.params.dishId);
    })
    .delete(authenticate.verifyUser, (req, res, next) => {
        Favorites.findOne({ user: req.user._id }, (err, favorite) => {
            if (err) return next(err);
            var index = favorite.dishes.indexOf(req.params.dishId);
            if (index >= 0) {
                favorite.dishes.splice(index, 1);
                favorite.save()
                    .then((favorite) => {
                        Favorites.findById(favorite._id)
                            .populate("user")
                            .populate("dishes")
                            .then((favorite) => {
                                res.statusCode = 200;
                                res.setHeader("Content-Type", "application/json");
                                res.json(favorite);
                            })

                    })
                    .catch((err) => {
                        return next(err);
                    })
            }
            else {
                res.statusCode = 404;
                res.setHeader("Content-Type", "text/plain");
                res.end("Dish " + req.params.dishId + " not in your Favorite List");
            }
        });
    });

module.exports = favoriteRouter;
