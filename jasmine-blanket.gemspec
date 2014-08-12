# coding: utf-8
lib = File.expand_path('../lib', __FILE__)
$LOAD_PATH.unshift(lib) unless $LOAD_PATH.include?(lib)
require 'jasmine/blanket/version'

Gem::Specification.new do |spec|
  spec.name          = "jasmine-blanket"
  spec.version       = Jasmine::Blanket::VERSION
  spec.authors       = ["Scott Carleton"]
  spec.email         = ["scott@artsicle.com"]
  spec.summary       = %q{Incorporate Blanket.js with Jasmine}
  spec.description   = %q{Make it easy to work with Blanket.js and Jasmine 2.0}
  spec.homepage      = ""
  spec.license       = "MIT"

  spec.files         = `git ls-files -z`.split("\x0")
  spec.executables   = spec.files.grep(%r{^bin/}) { |f| File.basename(f) }
  spec.test_files    = spec.files.grep(%r{^(test|spec|features)/})
  spec.require_paths = ["lib"]

  spec.add_development_dependency "bundler", "~> 1.6"
  spec.add_development_dependency "rake"

  spec.add_dependency "blanket-rails", "1.1.5"
end
