# Earthdata Search Components: ECHO Forms

[![npm version](https://badge.fury.io/js/%40edsc%2Fechoforms.svg)](https://badge.fury.io/js/%40edsc%2Fechoforms)
[![Build Status](https://travis-ci.org/nasa/edsc-echoforms.svg?branch=master)](https://travis-ci.org/nasa/edsc-echoforms)

Try out the [online demo](http://nasa.github.io/edsc-echoforms/)

A React component implementing the
[ECHO Forms](https://earthdata.nasa.gov/files/ECHO_Forms_Specification_0.pdf)
specification. For a basic usage example and a testbed for changes,
see `example/src`.

The ECHO Forms component was developed as a component of
[Earthdata Search](https://github.com/nasa/earthdata-search).

For the jQuery version of this plugin see [this branch](https://github.com/nasa/edsc-echoforms/tree/jquery-plugin).

## Installation

    npm install @edsc/echoforms

## Usage

After installing you can use the component in your code.

```javascript
import EDSCEchoform from '@edsc/echoforms'

const Component = () => {
  return (
    <EDSCEchoform
      form={formXml}
      onFormModelUpdated={onFormModelUpdated}
      onFormIsValidUpdated={onFormIsValidUpdated}
    />
  )
}
```

### Props

| Prop | Type | Required | Default Value | Description
| ---- |:----:|:--------:|:-------------:| -----------
addBootstrapClasses | Boolean | false | false | Adds Bootstrap class names to elements. Bootstrap is **not** included in this package.
form | String | true | | ECHO Forms XML string.
hasShapefile | Boolean | false | false | Is a shapefile included in the search parameters. This is used to display help text about shapefile processing to users on shapefile form fields.
prepopulateValues | Object | false | | Values used to prepopulate fields through the form's `pre:prepopulate` extensions.
onFormModelUpdated | Function | true | | Callback function that returns `{ model, rawModel }`. `model` is the data model pruned of irrelevant fields. `rawModel` is the full data model.
onFormIsValidUpdated | Function | true | | Callback function that returns a Boolean value of the form's isValid property.

## Development

To compile:

    npm install

To start the example project for local testing:

    npm start

To run the tests:

    npm test

## Contributing

See CONTRIBUTING.md

## License

> Copyright © 2007-2014 United States Government as represented by the Administrator of the National Aeronautics and Space Administration. All Rights Reserved.
>
> Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
> You may obtain a copy of the License at
>
>    http://www.apache.org/licenses/LICENSE-2.0
>
>Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS,
>WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
