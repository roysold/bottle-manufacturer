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


Object.defineProperty(exports, "__esModule", {
    value: true
});
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

exports.sortByField = sortByField;
exports.getListWithSelectedFields = getListWithSelectedFields;
exports.addLinksPropertyToList = addLinksPropertyToList;
exports.addLinksPropertyToObject = addLinksPropertyToObject;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// Example PropertyError:
// {
//     location: body[2],
//     value: "%%%",
//     msg: "Must be a number"
// }
var PropertyError = function PropertyError(location) {
    var value = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "";
    var msg = arguments[2];

    _classCallCheck(this, PropertyError);

    this.location = location;
    this.value = value;
    this.message = msg;
};

exports.default = PropertyError;

/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = require("express");

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.IDNotFoundError = exports.UnprocessableEntityError = exports.ConflictError = exports.BadQueryError = undefined;

var _BadQueryError = __webpack_require__(11);

var _BadQueryError2 = _interopRequireDefault(_BadQueryError);

var _ConflictError = __webpack_require__(12);

var _ConflictError2 = _interopRequireDefault(_ConflictError);

var _UnprocessableEntityError = __webpack_require__(13);

var _UnprocessableEntityError2 = _interopRequireDefault(_UnprocessableEntityError);

var _IDNotFoundError = __webpack_require__(14);

var _IDNotFoundError2 = _interopRequireDefault(_IDNotFoundError);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.BadQueryError = _BadQueryError2.default;
exports.ConflictError = _ConflictError2.default;
exports.UnprocessableEntityError = _UnprocessableEntityError2.default;
exports.IDNotFoundError = _IDNotFoundError2.default;

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


var _express = __webpack_require__(3);

var _express2 = _interopRequireDefault(_express);

var _httpStatusCodes = __webpack_require__(0);

var _httpStatusCodes2 = _interopRequireDefault(_httpStatusCodes);

var _bodyParser = __webpack_require__(9);

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _bottlesRouter = __webpack_require__(10);

var _bottlesRouter2 = _interopRequireDefault(_bottlesRouter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// var bottleTypesRouter = require("../routers/bottleTypesRouter.js").router;

var app = (0, _express2.default)();

app.use("/", function (req, res, next) {
    console.log("\nRequest received.");
    next();
});

app.use(_bodyParser2.default.json());

app.use("/", function (req, res, next) {
    if (req.get("content-type") !== undefined && !req.is("application/json")) {
        res.status(_httpStatusCodes2.default.UNSUPPORTED_MEDIA_TYPE).send("API only supports content type: application/json");
    } else {
        next();
    }
});

app.use(function (err, req, res, next) {
    if (err instanceof SyntaxError) {
        res.status(_httpStatusCodes2.default.BAD_REQUEST).send("Invalid JSON syntax.");
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
        res.status(_httpStatusCodes2.default.INTERNAL_SERVER_ERROR).send("Oops, server error...");
    }
});

app.use(function (req, res, next) {
    res.status(_httpStatusCodes2.default.NOT_FOUND).send("This is not a route.");
});

app.listen(3000);

/***/ }),
/* 9 */
/***/ (function(module, exports) {

module.exports = require("body-parser");

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _express = __webpack_require__(3);

var _express2 = _interopRequireDefault(_express);

var _httpStatusCodes = __webpack_require__(0);

var _httpStatusCodes2 = _interopRequireDefault(_httpStatusCodes);

var _index = __webpack_require__(4);

var _index2 = __webpack_require__(15);

var _IDGenerators = __webpack_require__(20);

var _IDGenerators2 = _interopRequireDefault(_IDGenerators);

var _IDValidations = __webpack_require__(21);

var _appendErrorToErrorsList = __webpack_require__(22);

var _appendErrorToErrorsList2 = _interopRequireDefault(_appendErrorToErrorsList);

var _getIndexByID = __webpack_require__(23);

var _getIndexByID2 = _interopRequireDefault(_getIndexByID);

var _index3 = __webpack_require__(24);

var _convertBodyToArray = __webpack_require__(28);

var _convertBodyToArray2 = _interopRequireDefault(_convertBodyToArray);

var _bottleSchemas = __webpack_require__(29);

var _bottleSchemas2 = _interopRequireDefault(_bottleSchemas);

var _index4 = __webpack_require__(30);

var _bottleProperties = __webpack_require__(35);

var _listFilters = __webpack_require__(1);

var _concatURLs = __webpack_require__(36);

var _concatURLs2 = _interopRequireDefault(_concatURLs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* Data */


/* Validators */


/* Body Validation */
//


/* PUT ID Validation */


/* CRUD Functions*/
var collection = __webpack_require__(37);

/* Entity Properties */


/* Query Validation */


/* ID Validation */


/* POST bottles */


/* Error types */


var router = _express2.default.Router();

collection = (0, _listFilters.addLinksPropertyToList)(collection, function (bottle) {
    return [["self", (0, _concatURLs2.default)("/api/v1/bottles", bottle[_bottleProperties.IDPropertyName])]];
});

function queryValidations(req, res, next) {
    res.locals.errors = [];
    var queryError = (0, _index4.validateQuery)(req.query, (0, _index3.filteringQueryValidations)(_bottleProperties.entityProperties));

    (0, _appendErrorToErrorsList2.default)(res.locals.errors, queryError);

    next();
}

// example route: /api/v1/bottles?sort=-id,creationDate,%2BfactoryID&fields=id,orderID,factoryID&offset=-2&limit=1
// Route sorts by descending id, ascending creationDate and factoryID.
// Displays id, orderID and factoryID fields.
// Gets only the second last object.
router.get("/", queryValidations, function (req, res, next) {
    if (res.locals.errors.length) {
        next(new _index.BadQueryError(res.locals.errors));
    } else {
        var objectsToSend = (0, _index2.getObjects)(collection, _bottleProperties.dateProperties, req.query);

        res.json(objectsToSend);
    }
});

router.param("id", function (req, res, next) {
    res.locals.indexOfObjectByID = (0, _getIndexByID2.default)(collection, req.params[_bottleProperties.IDPropertyName], _bottleProperties.IDPropertyName);

    res.locals.indexOfObjectByID === -1 ? next(new _index.IDNotFoundError(req.params[_bottleProperties.IDPropertyName], "params")) : next();
});

router.get("/:id", function (req, res) {
    res.json(collection[res.locals.indexOfObjectByID]);
});

router.delete("/:id", function (req, res) {
    (0, _index2.deleteByIndex)(collection, res.locals.indexOfObjectByID);

    res.status(_httpStatusCodes2.default.OK).send("Bottle deleted.");
});

function bodyValidations(req, res, next) {
    res.locals.errors = (0, _index4.validateCollection)(req.body, _bottleSchemas2.default[req.method]);

    next();
}

var IDGenerator = (0, _IDGenerators2.default)("9");

router.post("/", _convertBodyToArray2.default, bodyValidations, function (req, res, next) {
    if (res.locals.errors.length) {
        next(new _index.UnprocessableEntityError(res.locals.errors));
    } else {
        collection = (0, _index2.addObjects)(collection, req.body, _bottleProperties.entityProperties, _bottleProperties.IDPropertyName, IDGenerator, function (object) {
            return [["self", (0, _concatURLs2.default)(req.originalUrl, object[_bottleProperties.IDPropertyName])]];
        });

        res.status(_httpStatusCodes2.default.CREATED).send();
    }
});

router.put("/", _convertBodyToArray2.default, bodyValidations, (0, _IDValidations.checkForNonExistentID)(collection, _bottleProperties.IDPropertyName), (0, _IDValidations.checkForIDConflicts)(_bottleProperties.IDPropertyName), function (req, res, next) {
    if (res.locals.errors.length !== 0) {
        next(new _index.UnprocessableEntityError(res.locals.errors));
    } else {
        (0, _index2.updateObjects)(collection, req.body, _bottleProperties.entityProperties, _bottleProperties.IDPropertyName);
        res.send();
    }
});

exports.default = router;

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _httpStatusCodes = __webpack_require__(0);

var _httpStatusCodes2 = _interopRequireDefault(_httpStatusCodes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var BadQueryError = function () {
    function BadQueryError(errorJSON) {
        _classCallCheck(this, BadQueryError);

        this.errorJSON = errorJSON;
    }

    _createClass(BadQueryError, [{
        key: "httpErrorCode",
        get: function get() {
            return _httpStatusCodes2.default.BAD_REQUEST;
        }
    }]);

    return BadQueryError;
}();

exports.default = BadQueryError;

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _httpStatusCodes = __webpack_require__(0);

var _httpStatusCodes2 = _interopRequireDefault(_httpStatusCodes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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
            return _httpStatusCodes2.default.CONFLICT;
        }
    }]);

    return ConflictError;
}();

exports.default = ConflictError;

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _httpStatusCodes = __webpack_require__(0);

var _httpStatusCodes2 = _interopRequireDefault(_httpStatusCodes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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
            return _httpStatusCodes2.default.UNPROCESSABLE_ENTITY;
        }
    }]);

    return UnprocessableEntityError;
}();

exports.default = UnprocessableEntityError;

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _httpStatusCodes = __webpack_require__(0);

var _httpStatusCodes2 = _interopRequireDefault(_httpStatusCodes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var IDNotFoundError = function () {
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
            return _httpStatusCodes2.default.BAD_REQUEST;
        }
    }]);

    return IDNotFoundError;
}();

exports.default = IDNotFoundError;

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.deleteByIndex = exports.updateObjects = exports.addObjects = exports.getObjects = undefined;

var _getObjects = __webpack_require__(16);

var _getObjects2 = _interopRequireDefault(_getObjects);

var _addObjects = __webpack_require__(17);

var _addObjects2 = _interopRequireDefault(_addObjects);

var _updateObjects = __webpack_require__(18);

var _updateObjects2 = _interopRequireDefault(_updateObjects);

var _deleteByIndex = __webpack_require__(19);

var _deleteByIndex2 = _interopRequireDefault(_deleteByIndex);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.getObjects = _getObjects2.default;
exports.addObjects = _addObjects2.default;
exports.updateObjects = _updateObjects2.default;
exports.deleteByIndex = _deleteByIndex2.default;

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = getObjects;

var _listFilters = __webpack_require__(1);

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function getObjects(objects, dateProperties, query) {
    var offset = query.offset,
        limit = query.limit,
        fields = query.fields,
        sort = query.sort;


    sort = sort === undefined ? [] : sort.split(",");
    offset = offset === undefined ? 0 : parseInt(offset);
    limit = limit === undefined ? objects.length - offset : parseInt(limit);
    fields = fields === undefined ? undefined : fields.split(",");

    var sortedEntities = (0, _listFilters.sortByField)(objects, sort, dateProperties);

    var rangedEntities = sortedEntities.slice(offset, offset + limit);

    var entitiesWithSelectedFields = fields ? (0, _listFilters.getListWithSelectedFields)(rangedEntities, [].concat(_toConsumableArray(fields), ["links"])) : rangedEntities;

    return entitiesWithSelectedFields;
}

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = addObjects;

var _listFilters = __webpack_require__(1);

// TODO insertEntities?
//TODO addobjects or entities
function addObjects(objects, objectsToAdd, entityProperties, IDPropertyName, IDGenerator, generateLinks) {
    var cleanEntitiesToAdd = objectsToAdd.map(function (entity, index) {
        return getObjectWithID(entity, entityProperties, IDPropertyName, IDGenerator);
    });

    var entitiesWithLinks = (0, _listFilters.addLinksPropertyToList)(cleanEntitiesToAdd, generateLinks);

    return objects.concat(entitiesWithLinks);
}

function getObjectWithID(object, properties, IDPropertyName, IDGenerator) {
    var objectWithID = {};

    properties.forEach(function (prop) {
        objectWithID[prop] = object[prop];
    });

    objectWithID[IDPropertyName] = IDGenerator.next().value;

    return objectWithID;
}

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = updateObjects;
function updateObjects(listToUpdate, listWithUpdates, properties, IDPropertyName) {
    listWithUpdates.forEach(function (objectFromBody) {
        var entityToModify = listToUpdate.find(function (entity) {
            return entity[IDPropertyName] === objectFromBody[IDPropertyName];
        });

        updateObject(entityToModify, objectFromBody, properties);
    });
}

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
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = deleteByIndex;
function deleteByIndex(collection, index) {
    collection.splice(index, 1);
};

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = generateNextNumericID;

var _marked = /*#__PURE__*/regeneratorRuntime.mark(generateNextNumericID);

function generateNextNumericID(startID) {
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
    }, _marked, this);
}

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.checkForIDConflicts = exports.checkForNonExistentID = undefined;

var _index = __webpack_require__(4);

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
                next(new _index.IDNotFoundError(req.body[nonExistentIDEntityIndex][IDPropertyName]));
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
                next(new _index.ConflictError(conflictingID));
            }
        }

        next();
    };
};

exports.checkForNonExistentID = checkForNonExistentID;
exports.checkForIDConflicts = checkForIDConflicts;

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = appendErrorToErrorsList;
function appendErrorToErrorsList(errorsList, errorObj) {
    if (Object.keys(errorObj).length !== 0) {
        errorsList.push(errorObj);
    }
}

/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = getIndexByID;
function getIndexByID(list, id, IDPropertyName) {
    return list.findIndex(function (item) {
        return item[IDPropertyName] === id;
    });
};

/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.filteringQueryValidations = undefined;

var _filteringQueryValidations = __webpack_require__(25);

var _filteringQueryValidations2 = _interopRequireDefault(_filteringQueryValidations);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.filteringQueryValidations = _filteringQueryValidations2.default;

/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = filteringQueryValidations;

var _validations = __webpack_require__(26);

//

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
                    return areAllTrue([(0, _validations.isInSortFormat)(value, fields)]);
                });
            },
            errorMsg: "Needs to be either <field_name>, +<field_name>, -<field_name>."
        },
        "fields": {
            isValid: function isValid(values) {
                return values.split(",").every(function (value) {
                    return areAllTrue([(0, _validations.isIn)(value, fields)]);
                });
            },
            errorMsg: "Needs to be one or more real fields."
        },
        "offset": {
            isValid: function isValid(value) {
                return areAllTrue([(0, _validations.isNumericString)(value)]);
            },
            errorMsg: "Needs to be an integer."
        },
        "limit": {
            isValid: function isValid(value) {
                return areAllTrue([(0, _validations.isNumericString)(value)]);
            },
            errorMsg: "Needs to be an integer."
        }
    };
}

/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _validator = __webpack_require__(27);

var _validator2 = _interopRequireDefault(_validator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function isString(value) {
    return typeof value === "string";
}

exports.default = {
    isAlphanumericString: function isAlphanumericString(value) {
        return isString(value) && _validator2.default.isAlphanumeric(value);
    },

    isValidDateFormat: function isValidDateFormat(value) {
        return !isNaN(new Date(value).getTime());
    },

    isIn: function isIn(value, list) {
        return list.includes(value);
    },

    isNumericString: function isNumericString(value) {
        return isString(value) && _validator2.default.isNumeric(value);
    },

    isInSortFormat: function isInSortFormat(value, fields) {
        var field = value.replace(/^(\+|-)/, "");

        return fields.includes(field);
    },

    isSizeFormatString: function isSizeFormatString(value) {
        return isString(value) && _validator2.default.isFloat(stringWithoutLastChar(value)) && lastCharOfString(value);
    }
};


var stringWithoutLastChar = function stringWithoutLastChar(str) {
    return str.slice(0, -1);
};
var lastCharOfString = function lastCharOfString(str) {
    return str.substr(-1);
};

/***/ }),
/* 27 */
/***/ (function(module, exports) {

module.exports = require("validator");

/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = convertBodyToArray;
function convertBodyToArray(req, res, next) {
    if (!Array.isArray(req.body)) {
        req.body = [req.body];
    }

    next();
}

/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _joi = __webpack_require__(5);

var _joi2 = _interopRequireDefault(_joi);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var POSTbottleSchema = {
    creationDate: _joi2.default.date().required(),
    orderID: _joi2.default.string().regex(/^\d+$/).required(),
    factoryID: _joi2.default.string().regex(/^\d+$/).required()
};

var PUTbottleSchema = {
    id: _joi2.default.string().regex(/^\d+$/).required(),
    creationDate: _joi2.default.date(),
    orderID: _joi2.default.string().regex(/^\d+$/),
    factoryID: _joi2.default.string().regex(/^\d+$/)
};

exports.default = {
    POST: POSTbottleSchema,
    PUT: PUTbottleSchema
};

/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validateQuery = exports.ObjectValidator = exports.validateCollection = undefined;

var _validateCollection = __webpack_require__(31);

var _validateCollection2 = _interopRequireDefault(_validateCollection);

var _ObjectValidator = __webpack_require__(33);

var _ObjectValidator2 = _interopRequireDefault(_ObjectValidator);

var _validateQuery = __webpack_require__(34);

var _validateQuery2 = _interopRequireDefault(_validateQuery);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.validateCollection = _validateCollection2.default;
exports.ObjectValidator = _ObjectValidator2.default;
exports.validateQuery = _validateQuery2.default;

/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = validateCollection;

var _joi = __webpack_require__(5);

var _joi2 = _interopRequireDefault(_joi);

var _PropertyError = __webpack_require__(2);

var _PropertyError2 = _interopRequireDefault(_PropertyError);

var _lodash = __webpack_require__(32);

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function validateCollection(collection, joiSchema) {
    // In POST, bottles in body must have all properties except for ID.        
    var errors = [];

    collection.forEach(function (object, index) {
        var result = _joi2.default.validate(object, joiSchema, { allowUnknown: true, abortEarly: false });

        if (!_lodash2.default.isNull(result.error)) {
            result.error.details.forEach(function (detail) {
                errors.push(new _PropertyError2.default("body[" + index + "]", result.value[detail.context.key], detail.message));
            });
        }
    });

    return errors;
}

/***/ }),
/* 32 */
/***/ (function(module, exports) {

module.exports = require("lodash");

/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _PropertyError = __webpack_require__(2);

var _PropertyError2 = _interopRequireDefault(_PropertyError);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ObjectValidator = function () {
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
                        errors[property] = new _PropertyError2.default(index === -1 ? "body" : "body[" + index + "]", propertyValue, propertyValidationData.errorMsg);
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

exports.default = ObjectValidator;

/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = validateQuery;

var _PropertyError = __webpack_require__(2);

var _PropertyError2 = _interopRequireDefault(_PropertyError);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// const Joi = require("joi");
// const _ = require("lodash");

function validateQuery(query, validationsObj) {
    var errors = {};

    for (var param in query) {
        var paramValidationData = validationsObj[param];
        var paramValue = query[param];

        if (!paramValidationData.isValid(paramValue)) {
            errors[param] = new _PropertyError2.default("query", paramValue, paramValidationData.errorMsg);
        }
    }

    return Object.keys(errors).length === 0 ? {} : { errors: errors };
} // const ObjectValidator = require("../validators/ObjectValidator.js");

/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var entityProperties = ["id", "creationDate", "orderID", "factoryID"];
var IDPropertyName = "id";
var dateProperties = ["creationDate"];

exports.entityProperties = entityProperties;
exports.IDPropertyName = IDPropertyName;
exports.dateProperties = dateProperties;

/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = concatURLs;
function concatURLs(url1, url2) {
    return "" + url1.replace(/\/*$/, "/") + url2;
}

/***/ }),
/* 37 */
/***/ (function(module, exports) {

module.exports = [{"id":"1","creationDate":"2017-11-01","orderID":"1","factoryID":"1"},{"id":"2","creationDate":"2017-11-01","orderID":"1","factoryID":"1"},{"id":"3","creationDate":"2017-11-02","orderID":"1","factoryID":"1"},{"id":"4","creationDate":"2017-11-02","orderID":"2","factoryID":"1"},{"id":"5","creationDate":"2017-11-02","orderID":"2","factoryID":"1"},{"id":"6","creationDate":"2017-11-04","orderID":"2","factoryID":"1"},{"id":"7","creationDate":"2017-11-12","orderID":"3","factoryID":"2"},{"id":"8","creationDate":"2017-11-12","orderID":"3","factoryID":"2"}]

/***/ })
/******/ ]);