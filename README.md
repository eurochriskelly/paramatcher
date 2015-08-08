#paramatcher

Description:

A simple object parameter matcher.

This tool allows checking object properties using preset boolean
rules. For example, checking that all required parameters exist in the
expected combination.

## Basic Usage:
### Installation 

```
npm install paramatcher
```

### Import library:
```
var paramatcher = require('paramatcher');
```

### Define match rules (here without conditions):

Build with a string:

```
var validPassport = paramatcher.build('nationality && (passportNumber || (name && age))');
```

### Test against a real a list of parameters
```
var Bob =  {
    nationality : 'English',
    name : 'Bob',
    age : 100
};

validPassport.test(Bob); // true

// don't have personal info but have passport number
var Anon =  {
    nationality : 'English',
    passportNumber : 'GHSJE3423'
};

validPassport.test(Bob); // true
```
