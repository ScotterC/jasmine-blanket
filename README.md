# Jasmine::Blanket

Easy incorporation of [Blanket.js](https://github.com/alex-seville/blanket) with [Jasmine 2.0](https://github.com/pivotal/jasmine-gem)

## Installation

Add this line to your application's Gemfile:

    gem 'jasmine-blanket'

And then execute:

    $ bundle

Or install it yourself as:

    $ gem install jasmine-blanket

Assuming you're using the jasmine gem, in your jasmine.yml have:

    src_files:
      - ...
      - assets/blanket.js
      - assets/jasmine-blanket.js

Or directly include it in your test runner with `/assets/blanket.js` and `/assets/jasmine-blanket.js`

## Usage

For Blanket.js
[Blanket JS Usage](http://blanketjs.org/)

Adding JS Folders that you want covered by Blanket.  Note: it's not very smart at the moment.

In jasmine.yml

    included_blanket_folders:
      - '/backbone/'

    excluded_blanket_folders:
      - '__spec__'
      - '/templates/'

    coverage_threshold: 90

In jasmine_helper.rb

    Jasmine::Blanket.load_configuration_from_yaml

In Browser

    rake jasmine

Headless or CI

    rake jasmine:ci

## Acknowledgements

Jasmine adaptor is from @alex-seville's [Blanket.js]((http://blanketjs.org/))
Travis Coverage JS is also @alex-seville's [TravisCov](https://github.com/alex-seville/travis-cov)

## Version

Matches Jasmine version with a minor version

## TODO

* Testing
* Clean up the configuration hacks
* Find a way around monkey patching jasmine-gem

## Contributing

1. Fork it ( https://github.com/ScotterC/jasmine-blanket/fork )
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create a new Pull Request
