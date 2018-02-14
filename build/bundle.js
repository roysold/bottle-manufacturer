/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 6);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = require("http-status-codes");

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function sortByField(list, sortFields, dateFields) {
    var sortedList = list.slice();

    sortFields.slice().reverse().forEach(function (sortField) {
        var field = sortField.replace(/^(\+|-)/, "");

        sortedList.sort(getCompareItemByFieldFunction(field, dateFields.includes(field), !sortField.startsWith("-")));
    });
    return sortedList;
}

function getListWithSelectedFields(list, fields) {
    return list.map(function (obj) {
        var objWithSelectedfields = {};

        fields.forEach(function (field) {
            objWithSelectedfields[field] = obj[field];
        });

        return objWithSelectedfields;
    });
}

function getCompareItemByFieldFunction(field, isDate, ascending) {
    if (!ascending) {
        return function (item1, item2) {
            var _getComparableValues = getComparableValues(item1[field], item2[field], isDate),
                value1 = _getComparableValues.value1,
                value2 = _getComparableValues.value2;

            return value2 - value1;
        };
    } else {
        return function (item1, item2) {
            var _getComparableValues2 = getComparableValues(item1[field], item2[field], isDate),
                value1 = _getComparableValues2.value1,
                value2 = _getComparableValues2.value2;

            return value1 - value2;
        };
    }
}

function getComparableValues(value1, value2, isDate) {
    if (isDate) {
        value1 = new Date(value1);
        value2 = new Date(value2);
    }

    return {
        value1: value1,
        value2: value2
    };
}

function addLinksPropertyToList(list, generateLinks) {
    return list.map(function (object) {
        return addLinksPropertyToObject(object, generateLinks(object));
    });
}

// param: linkDataToAdd - A list of lists, 
// where each inner list has the format: [rel, href].
function addLinksPropertyToObject(obj, linkDataToAdd) {
    var objectToReturn = Object.assign({}, obj);

    if (!obj.hasOwnProperty("links")) {
        objectToReturn.links = [];
    }

    linkDataToAdd.forEach(function (linkData) {
        objectToReturn.links.push({
            rel: linkData[0],
            href: linkData[1]
        });
    });

    return objectToReturn;
}

module.exports = {
    sortByField: sortByField,
    getListWithSelectedFields: getListWithSelectedFields,
    addLinksPropertyToList: addLinksPropertyToList,
    addLinksPropertyToObject: addLinksPropertyToObject
};

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// Example PropertyError:
// {
//     location: body[2],
//     value: "%%%",
//     msg: "Must be a number"
// }
module.exports = function PropertyError(location) {
    var value = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "";
    var msg = arguments[2];

    _classCallCheck(this, PropertyError);

    this.location = location;
    this.value = value;
    this.message = msg;
};

/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = require("express");

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = {
    BadQueryError: __webpack_require__(10),
    ConflictError: __webpack_require__(11),
    UnprocessableEntityError: __webpack_require__(12),
    IDNotFoundError: __webpack_require__(13)
};

/***/ }),
/* 5 */
/***/ (function(module, exports) {

module.exports = require("joi");

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(7);
module.exports = __webpack_require__(8);


/***/ }),
/* 7 */
/***/ (function(module, exports) {

module.exports = require("babel-polyfill");

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _bottlesRouter = __webpack_require__(9);

var _bottlesRouter2 = _interopRequireDefault(_bottlesRouter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var express = __webpack_require__(3);
var httpStatusCodes = __webpack_require__(0);
var bodyParser = __webpack_require__(37);

// var bottleTypesRouter = require("../routers/bottleTypesRouter.js").router;

var app = express();

app.use("/", function (req, res, next) {
    console.log("Request received.");
    next();
});

app.use(bodyParser.json());

app.use("/", function (req, res, next) {
    if (req.get("content-type") !== undefined && !req.is("application/json")) {
        res.status(httpStatusCodes.UNSUPPORTED_MEDIA_TYPE).send("API only supports content type: application/json");
    } else {
        next();
    }
});

app.use(function (err, req, res, next) {
    if (err instanceof SyntaxError) {
        res.status(httpStatusCodes.BAD_REQUEST).send("Invalid JSON syntax.");
    }
});

app.use("/api/v1/bottles", _bottlesRouter2.default);
// app.use("/api/v1/bottletypes", bottleTypesRouter);

app.use("/", function (err, req, res, next) {
    console.log("Time: " + new Date());
    console.log("err.message: " + err.message);
    console.log("" + (err.stack !== undefined ? "stack: " + err.stack : ""));

    if (err.httpErrorCode !== undefined) {
        res.status(err.httpErrorCode).send(err.errorJSON);
    } else {
        res.status(httpStatusCodes.INTERNAL_SERVER_ERROR).send("Oops, server error...");
    }
});

app.use(function (req, res, next) {
    res.status(httpStatusCodes.NOT_FOUND).send("This is not a route.");
});

app.listen(3000);

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var express = __webpack_require__(3);
var httpStatusCodes = __webpack_require__(0);

/* Error types */

var _require = __webpack_require__(4),
    UnprocessableEntityError = _require.UnprocessableEntityError,
    BadQueryError = _require.BadQueryError,
    IDNotFoundError = _require.IDNotFoundError;

/* CRUD Functions*/


var _require2 = __webpack_require__(14),
    getObjects = _require2.getObjects,
    addObjects = _require2.addObjects,
    updateObjects = _require2.updateObjects,
    deleteByIndex = _require2.deleteByIndex;

/* POST bottles */


var generateNextNumericID = __webpack_require__(19);

/* PUT ID Validation */

var _require3 = __webpack_require__(20),
    checkForNonExistentID = _require3.checkForNonExistentID,
    checkForIDConflicts = _require3.checkForIDConflicts;

/* ID Validation */


var appendErrorToErrorsList = __webpack_require__(21);
var getIndexByID = __webpack_require__(22);

/* Query Validation */

var _require4 = __webpack_require__(23),
    filteringQueryValidations = _require4.filteringQueryValidations;

/* Body Validation */


var convertBodyToArray = __webpack_require__(27);
var bottleSchema = __webpack_require__(28);

/* Validators */

var _require5 = __webpack_require__(29),
    validateCollection = _require5.validateCollection,
    validateQuery = _require5.validateQuery;

/* Entity Properties */


var _require6 = __webpack_require__(34),
    entityProperties = _require6.entityProperties,
    IDPropertyName = _require6.IDPropertyName,
    dateProperties = _require6.dateProperties;

/* Data */


var collection = __webpack_require__(35);

var _require7 = __webpack_require__(1),
    addLinksPropertyToList = _require7.addLinksPropertyToList;

var concatURLs = __webpack_require__(36);

var router = express.Router();

collection = addLinksPropertyToList(collection, function (bottle) {
    return [["self", concatURLs("/api/v1/bottles", bottle[IDPropertyName])]];
});

// const filteringQueryValidator =
//     new QueryValidator(
//         filteringQueryValidations(
//             entityProperties
//         )
//     );

function queryValidations(req, res, next) {
    res.locals.errors = [];
    var queryError = validateQuery(req.query, filteringQueryValidations(entityProperties));

    appendErrorToErrorsList(res.locals.errors, queryError);

    next();
}

// example route: /api/v1/bottles?sort=-id,creationDate,%2BfactoryID&fields=id,orderID,factoryID&offset=-2&limit=1
// Route sorts by descending id, ascending creationDate and factoryID.
// Displays id, orderID and factoryID fields.
// Gets only the second last object.
router.get("/", queryValidations, function (req, res, next) {
    if (res.locals.errors.length) {
        next(new BadQueryError(res.locals.errors));
    } else {
        var objectsToSend = getObjects(collection, dateProperties, req.query);

        res.json(objectsToSend);
    }
});

router.param("id", function (req, res, next) {
    res.locals.indexOfObjectByID = getIndexByID(collection, req.params[IDPropertyName], IDPropertyName);

    res.locals.indexOfObjectByID === -1 ? next(new IDNotFoundError(req.params[IDPropertyName], "params")) : next();
});

router.get("/:id", function (req, res) {
    res.json(collection[res.locals.indexOfObjectByID]);
});

router.delete("/:id", function (req, res) {
    deleteByIndex(collection, res.locals.indexOfObjectByID);

    res.status(httpStatusCodes.OK).send("Bottle deleted.");
});

function bodyValidations(req, res, next) {
    res.locals.errors = validateCollection(req.body, bottleSchema[req.method]);

    next();
}

var IDGenerator = generateNextNumericID("9");

router.post("/", convertBodyToArray, bodyValidations, function (req, res, next) {
    if (res.locals.errors.length) {
        next(new UnprocessableEntityError(res.locals.errors));
    } else {
        collection = addObjects(collection, req.body, entityProperties, IDPropertyName, IDGenerator, function (object) {
            return [["self", concatURLs(req.originalUrl, object[IDPropertyName])]];
        });

        res.status(httpStatusCodes.CREATED).send();
    }
});

router.put("/", convertBodyToArray, bodyValidations, checkForNonExistentID(collection, IDPropertyName), checkForIDConflicts(IDPropertyName), function (req, res, next) {
    if (res.locals.errors.length !== 0) {
        next(new UnprocessableEntityError(res.locals.errors));
    } else {
        updateObjects(collection, req.body, entityProperties, IDPropertyName);
        res.send();
    }
});

module.exports = router;

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var httpStatusCodes = __webpack_require__(0);

module.exports = function () {
    function BadQueryError(errorJSON) {
        _classCallCheck(this, BadQueryError);

        this.errorJSON = errorJSON;
    }

    _createClass(BadQueryError, [{
        key: "httpErrorCode",
        get: function get() {
            return httpStatusCodes.BAD_REQUEST;
        }
    }]);

    return BadQueryError;
}();

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var httpStatusCodes = __webpack_require__(0);

var ConflictError = function () {
    function ConflictError(id) {
        _classCallCheck(this, ConflictError);

        this.message = "Conflicting IDs in body.";
        this.conflictingID = id;
    }

    _createClass(ConflictError, [{
        key: "errorJSON",
        get: function get() {
            return {
                error: {
                    message: this.message,
                    conflictingID: this.conflictingID
                }
            };
        }
    }, {
        key: "httpErrorCode",
        get: function get() {
            return httpStatusCodes.CONFLICT;
        }
    }]);

    return ConflictError;
}();

module.exports = ConflictError;

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var httpStatusCodes = __webpack_require__(0);

var UnprocessableEntityError = function () {
    function UnprocessableEntityError(errors) {
        _classCallCheck(this, UnprocessableEntityError);

        this.errors = errors;
    }

    _createClass(UnprocessableEntityError, [{
        key: "errorJSON",
        get: function get() {
            return this.errors;
        }
    }, {
        key: "httpErrorCode",
        get: function get() {
            return httpStatusCodes.UNPROCESSABLE_ENTITY;
        }
    }]);

    return UnprocessableEntityError;
}();

module.exports = UnprocessableEntityError;

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var httpStatusCodes = __webpack_require__(0);

module.exports = function () {
    function IDNotFoundError(id, location) {
        _classCallCheck(this, IDNotFoundError);

        this.message = "No bottle with this ID.";
        this.id = id;
        this.location = location;
    }

    _createClass(IDNotFoundError, [{
        key: "errorJSON",
        get: function get() {
            return {
                error: {
                    location: this.location,
                    message: this.message,
                    ID: this.id
                }
            };
        }
    }, {
        key: "httpErrorCode",
        get: function get() {
            return httpStatusCodes.BAD_REQUEST;
        }
    }]);

    return IDNotFoundError;
}();

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = {
    getObjects: __webpack_require__(15),
    addObjects: __webpack_require__(16),
    updateObjects: __webpack_require__(17),
    deleteByIndex: __webpack_require__(18)
};

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var _require = __webpack_require__(1),
    sortByField = _require.sortByField,
    getListWithSelectedFields = _require.getListWithSelectedFields;

module.exports = function getObjects(objects, dateProperties, query) {
    var offset = query.offset,
        limit = query.limit,
        fields = query.fields,
        sort = query.sort;


    sort = sort === undefined ? [] : sort.split(",");
    offset = offset === undefined ? 0 : parseInt(offset);
    limit = limit === undefined ? objects.length - offset : parseInt(limit);
    fields = fields === undefined ? undefined : fields.split(",");

    var sortedEntities = sortByField(objects, sort, dateProperties);

    var rangedEntities = sortedEntities.slice(offset, offset + limit);

    var entitiesWithSelectedFields = fields ? getListWithSelectedFields(rangedEntities, [].concat(_toConsumableArray(fields), ["links"])) : rangedEntities;

    return entitiesWithSelectedFields;
};

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _require = __webpack_require__(1),
    addLinksPropertyToList = _require.addLinksPropertyToList;

// TODO insertEntities?
//TODO addobjects or entities


module.exports = function addObjects(objects, objectsToAdd, entityProperties, IDPropertyName, IDGenerator, generateLinks) {
    var cleanEntitiesToAdd = objectsToAdd.map(function (entity, index) {
        return getObjectWithID(entity, entityProperties, IDPropertyName, IDGenerator);
    });

    var entitiesWithLinks = addLinksPropertyToList(cleanEntitiesToAdd, generateLinks);

    return objects.concat(entitiesWithLinks);
};

function getObjectWithID(object, properties, IDPropertyName, IDGenerator) {
    var objectWithID = {};

    properties.forEach(function (prop) {
        objectWithID[prop] = object[prop];
    });

    objectWithID[IDPropertyName] = IDGenerator.next().value;

    return objectWithID;
}

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function updateObjects(listToUpdate, listWithUpdates, properties, IDPropertyName) {
    listWithUpdates.forEach(function (objectFromBody) {
        var entityToModify = listToUpdate.find(function (entity) {
            return entity[IDPropertyName] === objectFromBody[IDPropertyName];
        });

        updateObject(entityToModify, objectFromBody, properties);
    });
};

var hasProperty = function hasProperty(object, property) {
    return object[property] !== undefined;
};

function updateObject(objToUpdate, objWithUpdates, properties) {
    properties.forEach(function (property) {
        if (hasProperty(objWithUpdates, property)) {
            objToUpdate[property] = objWithUpdates[property];
        }
    });
}

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function deleteByIndex(collection, index) {
    collection.splice(index, 1);
};

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = /*#__PURE__*/regeneratorRuntime.mark(function generateNextNumericID(startID) {
    var currentID;
    return regeneratorRuntime.wrap(function generateNextNumericID$(_context) {
        while (1) {
            switch (_context.prev = _context.next) {
                case 0:
                    currentID = parseInt(startID);

                case 1:
                    if (false) {
                        _context.next = 6;
                        break;
                    }

                    _context.next = 4;
                    return String(currentID++);

                case 4:
                    _context.next = 1;
                    break;

                case 6:
                case "end":
                    return _context.stop();
            }
        }
    }, generateNextNumericID, this);
});

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _require = __webpack_require__(4),
    IDNotFoundError = _require.IDNotFoundError,
    ConflictError = _require.ConflictError;

function getNonExistentIDObjectIndex(objects, objectsToCheck, IDPropertyName) {
    return objectsToCheck.findIndex(function (objectToCheck) {
        return !objects.map(function (object) {
            return object[IDPropertyName];
        }).includes(objectToCheck[IDPropertyName]);
    });
}

function findConflictingIDInList(list, IDPropertyName) {
    var IDs = [];
    var conflictingID = "";

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = list[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var item = _step.value;

            var curID = item[IDPropertyName];

            if (IDs.includes(curID)) {
                conflictingID = curID;
                break;
            } else {
                IDs.push(curID);
            }
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
            }
        } finally {
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }

    return conflictingID;
}

var isArrayEmpty = function isArrayEmpty(arr) {
    return arr.length === 0;
};

var checkForNonExistentID = function checkForNonExistentID(collection, IDPropertyName) {
    return function (req, res, next) {
        if (isArrayEmpty(res.locals.errors)) {
            var nonExistentIDEntityIndex = getNonExistentIDObjectIndex(collection, req.body, IDPropertyName);

            if (nonExistentIDEntityIndex !== -1) {
                next(new IDNotFoundError(req.body[nonExistentIDEntityIndex][IDPropertyName]));
            }
        }

        next();
    };
};

var checkForIDConflicts = function checkForIDConflicts(IDPropertyName) {
    return function (req, res, next) {
        if (isArrayEmpty(res.locals.errors)) {
            var conflictingID = findConflictingIDInList(req.body, "id");

            if (conflictingID !== "") {
                next(new ConflictError(conflictingID));
            }
        }

        next();
    };
};

module.exports = {
    checkForNonExistentID: checkForNonExistentID,
    checkForIDConflicts: checkForIDConflicts
};

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function appendErrorToErrorsList(errorsList, errorObj) {
    if (Object.keys(errorObj).length !== 0) {
        errorsList.push(errorObj);
    }
};

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function getIndexByID(list, id, IDPropertyName) {
    return list.findIndex(function (item) {
        return item[IDPropertyName] === id;
    });
};

/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = {
    filteringQueryValidations: __webpack_require__(24)
};

/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _require = __webpack_require__(25),
    isInSortFormat = _require.isInSortFormat,
    isIn = _require.isIn,
    isNumericString = _require.isNumericString;

function areAllTrue(values) {
    return values.every(function (value) {
        return value === true;
    });
}

function filteringQueryValidations(fields) {
    return {
        "sort": {
            isValid: function isValid(values) {
                return values.split(",").every(function (value) {
                    return areAllTrue([isInSortFormat(value, fields)]);
                });
            },
            errorMsg: "Needs to be either <field_name>, +<field_name>, -<field_name>."
        },
        "fields": {
            isValid: function isValid(values) {
                return values.split(",").every(function (value) {
                    return areAllTrue([isIn(value, fields)]);
                });
            },
            errorMsg: "Needs to be one or more real fields."
        },
        "offset": {
            isValid: function isValid(value) {
                return areAllTrue([isNumericString(value)]);
            },
            errorMsg: "Needs to be an integer."
        },
        "limit": {
            isValid: function isValid(value) {
                return areAllTrue([isNumericString(value)]);
            },
            errorMsg: "Needs to be an integer."
        }
    };
}

module.exports = filteringQueryValidations;

/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var validator = __webpack_require__(26);

function isString(value) {
    return typeof value === "string";
}

module.exports = {
    isAlphanumericString: function isAlphanumericString(value) {
        return isString(value) && validator.isAlphanumeric(value);
    },

    isValidDateFormat: function isValidDateFormat(value) {
        return !isNaN(new Date(value).getTime());
    },

    isIn: function isIn(value, list) {
        return list.includes(value);
    },

    isNumericString: function isNumericString(value) {
        return isString(value) && validator.isNumeric(value);
    },

    isInSortFormat: function isInSortFormat(value, fields) {
        var field = value.replace(/^(\+|-)/, "");

        return fields.includes(field);
    },

    isSizeFormatString: function isSizeFormatString(value) {
        return isString(value) && validator.isFloat(stringWithoutLastChar(value)) && lastCharOfString(value);
    }
};

var stringWithoutLastChar = function stringWithoutLastChar(str) {
    return str.slice(0, -1);
};
var lastCharOfString = function lastCharOfString(str) {
    return str.substr(-1);
};

/***/ }),
/* 26 */
/***/ (function(module, exports) {

module.exports = require("validator");

/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function convertBodyToArray(req, res, next) {
    if (!Array.isArray(req.body)) {
        req.body = [req.body];
    }

    next();
};

/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Joi = __webpack_require__(5);

var POSTbottleSchema = {
    creationDate: Joi.date().required(),
    orderID: Joi.string().regex(/^\d+$/).required(),
    factoryID: Joi.string().regex(/^\d+$/).required()
};

var PUTbottleSchema = {
    id: Joi.string().regex(/^\d+$/).required(),
    creationDate: Joi.date(),
    orderID: Joi.string().regex(/^\d+$/),
    factoryID: Joi.string().regex(/^\d+$/)
};

module.exports = {
    POST: POSTbottleSchema,
    PUT: PUTbottleSchema
};

/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = {
    validateCollection: __webpack_require__(30),
    ObjectValidator: __webpack_require__(32),
    validateQuery: __webpack_require__(33)
};

/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Joi = __webpack_require__(5);
var PropertyError = __webpack_require__(2);
var _ = __webpack_require__(31);

module.exports = function validateCollection(collection, joiSchema) {
    // In POST, bottles in body must have all properties except for ID.        
    var errors = [];

    collection.forEach(function (object, index) {
        var result = Joi.validate(object, joiSchema, { allowUnknown: true, abortEarly: false });

        if (!_.isNull(result.error)) {
            result.error.details.forEach(function (detail) {
                errors.push(new PropertyError("body[" + index + "]", result.value[detail.context.key], detail.message));
            });
        }
    });

    return errors;
};

/***/ }),
/* 31 */
/***/ (function(module, exports) {

module.exports = require("lodash");

/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PropertyError = __webpack_require__(2);

module.exports = function () {
    function ObjectValidator(properties, validationsObj) {
        _classCallCheck(this, ObjectValidator);

        this.propertiesToValidate = properties;
        this.validationsObj = validationsObj;
    }

    _createClass(ObjectValidator, [{
        key: "validateObject",
        value: function validateObject(object) {
            var index = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : -1;

            var errors = {};

            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = this.propertiesToValidate[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var property = _step.value;

                    var propertyValidationData = this.validationsObj[property];
                    var propertyValue = object[property];

                    if (!propertyValidationData.isValid(propertyValue)) {
                        errors[property] = new PropertyError(index === -1 ? "body" : "body[" + index + "]", propertyValue, propertyValidationData.errorMsg);
                    }
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }

            return Object.keys(errors).length === 0 ? {} : { errors: errors };
        }
    }]);

    return ObjectValidator;
}();

/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// const ObjectValidator = require("../validators/ObjectValidator.js");
var PropertyError = __webpack_require__(2);
// const Joi = require("joi");
// const _ = require("lodash");

module.exports = function validateQuery(query, validationsObj) {
    var errors = {};

    for (var param in query) {
        var paramValidationData = validationsObj[param];
        var paramValue = query[param];

        if (!paramValidationData.isValid(paramValue)) {
            errors[param] = new PropertyError("query", paramValue, paramValidationData.errorMsg);
        }
    }

    return Object.keys(errors).length === 0 ? {} : { errors: errors };
};

/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = {
    entityProperties: ["id", "creationDate", "orderID", "factoryID"],
    IDPropertyName: "id",
    dateProperties: ["creationDate"]
};

/***/ }),
/* 35 */
/***/ (function(module, exports) {

module.exports = [{"id":"1","creationDate":"2017-11-01","orderID":"1","factoryID":"1"},{"id":"2","creationDate":"2017-11-01","orderID":"1","factoryID":"1"},{"id":"3","creationDate":"2017-11-02","orderID":"1","factoryID":"1"},{"id":"4","creationDate":"2017-11-02","orderID":"2","factoryID":"1"},{"id":"5","creationDate":"2017-11-02","orderID":"2","factoryID":"1"},{"id":"6","creationDate":"2017-11-04","orderID":"2","factoryID":"1"},{"id":"7","creationDate":"2017-11-12","orderID":"3","factoryID":"2"},{"id":"8","creationDate":"2017-11-12","orderID":"3","factoryID":"2"}]

/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function concatURLs(url1, url2) {
    return "" + url1.replace(/\/*$/, "/") + url2;
};

/***/ }),
/* 37 */
/***/ (function(module, exports) {

module.exports = require("body-parser");

/***/ })
/******/ ]);