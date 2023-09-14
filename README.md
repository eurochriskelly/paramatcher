# Paramatcher

## Overview

Paramatcher is a simple object validation tool that allows checking object properties using preset boolean rules. For example, it checks that all required parameters exist in the expected combination.

## Installation

`npm install paramatcher`


## Usage

Import the library and use the `build` function to create a validation object.

### Import library

`const { build } = require('paramatcher');`

### Define Match Rules:

`const validPassport = build('nationality && (passportNumber || (name && age))');`

This rule requires an object to have a `nationality` and either a `passportNumber` or both `name` and `age`.

### Test against a real object

```
var Bob = {
    nationality : 'English',
    name : 'Bob',
    age : 100
};

validPassport.test(Bob); // returns true

// Don't have personal info but have passport number
var Anon = {
    nationality : 'English',
    passportNumber : 'GHSJE3423'
};

validPassport.test(Anon); // returns true
```

### Error Handling

The Paramatcher module includes a `warnings` array in the returned instance from `build()`. This array contains any errors or warnings encountered during the parsing and building phase.

## Contributing

If you would like to contribute to this project, please fork the repository and submit a pull request.

