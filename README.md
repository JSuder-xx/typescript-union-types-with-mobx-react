# TypeScript Union Types with Mobx & React

# Static Typing Stragegies 
## Discriminated Unions 
### Representing Field States
A common idiom in View/View Model architectures is to represent an editable field's visibility and read-only state with two independent properties on the View Model. For example, a firstName property that may be invisible in some contexts and read-only in other contexts may be represented with three separate properties on the view model:
* firstName - a read/write property to which the view two-way data-binds.
* isFirstNameVisible - a read-only property that may change in time.
* isFirstNameReadOnly - a read-only property that may change in time.

This information representation is fraught with opportunities for improper usage/access such as
* Reading the firstName property when not isFirstNameVisible.
* Writing the firstName property when isFirstNameReadOnly.

The view model may protect itself from inappropriate access by throwing exceptions but this is terribly opaque and leads to the likelihood of run-time faults. 

Run-time faults can be avoided altogether by employing Discriminated Unions (AKA Variants, Tagged Unions, Sum Types, Enumerations) to represent the valid states in such a way that meaning and usage are explicit and compiler verifiable.

Consider instead the Mobx code below
```TypeScript
@computed firstName: null | string | (firstName?: string) => string;
```

The property is computed because it changes reactively based on the state of the editor. 

The type signature clearly indicates three possible cases
* null - indicates that the field is not available. This corresponds to invisible.
* string - denotes a read-only state of the field. The user can read but not modify.
* (firstName?: string) => string - represents a getter/setter function which can be used to both read and write the value.

By using a discriminated union the TypeScript compiler can guarantee that developers cannot expose a hidden field or allow mutation of a read-only field (without intentionally subverting the type system). 

### Representing Actions
Similarly, the common idiom for representing an action in a View Model is to provide a method on the view model for the action and a read-only property that indicates whether the action is available or enabled at the current time. 

Once again, when modeled this way the type system cannot stop code from attempting to execute the method. Developers only recourse is to check for validity inside the method and throw an exception.

This can be modeled in a type-safe fashion with
```TypeScript
@computed doAwesomeThing: null | () => void;
```


# Installation
Initial run:

* Install Node.js
* `npm install`
* `npm start`

