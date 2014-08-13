require 'rails'
require 'blanket/rails'
require "jasmine-blanket/configuration"
require "jasmine-blanket/engine"
require "jasmine-blanket/version"

module Jasmine
  module Blanket
    require 'yaml'

    def self.configure(&block)
      block.call(self.config)
    end

    def self.initialize_config
      @config = Jasmine::Blanket::Configuration.new
    end

    def self.config
      initialize_config
      @config
    end

    def self.load_configuration_from_yaml(path = nil)
      path ||= File.join(Dir.pwd, 'spec', 'javascripts', 'support', 'jasmine.yml')
      if File.exist?(path)
        yaml_config = YAML::load(File.read(path))

        Jasmine::Blanket.configure do |config|
          config.included_folders = yaml_config["included_blanket_folders"] if yaml_config["included_blanket_folders"].any?
          config.excluded_folders = yaml_config["excluded_blanket_folders"] if yaml_config["excluded_blanket_folders"].any?
          config.coverage_threshold = yaml_config["coverage_threshold"] if yaml_config["coverage_threshold"]
        end
      else
       raise ConfigNotFound, "Unable to load jasmine config from #{path}"
      end
    end

    # Temporary hacks
    def self.included_folders
      @config.included_folders
    end

    def self.excluded_folders
      @config.excluded_folders
    end

    def self.coverage_threshold
      @config.coverage_threshold
    end

  end

  # Monkey Patches

  # To use our template
  def self.runner_template
    File.read(File.join(File.dirname(__FILE__), "run.html.erb"))
  end

  # To use our jasmine runner
  module Runners
    class PhantomJs
      def run
        command = "#{phantom_js_path} '#{File.join(File.dirname(__FILE__), 'phantom_jasmine_runner.js')}' #{jasmine_server_url} #{result_batch_size}"

        IO.popen(command) do |output|
          output.each do |line|
            if line =~ /^jasmine_result/
              line = line.sub(/^jasmine_result/, '')
              raw_results = JSON.parse(line, :max_nesting => false)
              results = raw_results.map { |r| Result.new(r) }
              formatter.format(results)
            elsif line =~ /^coverage_result/
              puts "\n"
              puts line.sub(/^coverage_result/, '')
            end
          end
        end
        formatter.done
      end
    end
  end

end
