# config valid only for current version of Capistrano
lock "3.8.0"

set :application, 'sanpablo'
set :repo_url, 'git@bitbucket.org:farmaciasanpablo/recommender.git'
# set :format_options, color: :auto, truncate: 80

set :deploy_to, "/home/deploy/app/#{fetch :application}"
set :root_path, "/home/deploy/app/#{fetch :application}"

# Default value for :format is :airbrussh.
set :format, :airbrussh

# Default value for keep_releases is 5
set :keep_releases, 3

# Default value for :linked_files is []
set :linked_files, %w{.env}


set :pm2_app_command, 'ecosystem.json'
set :pm2_app_name, fetch(:application)
set :pm2_target_path, -> { release_path }
set :pm2_roles, [:app, :worker]

# nginx configurations
set :nginx_roles, [:worker]
set :nginx_application_name, "app-#{fetch :application}-#{fetch :stage}"
set :nginx_template, "config/deploy/shared/nginx.conf.erb"

namespace :deploy do

  desc 'Restart application'
  task :restart_app do
    invoke 'pm2:restart'
  end

  desc 'Update the nginx file configuration and restart'
  task :update_nginx do
    invoke 'nginx:site:add'
    invoke 'nginx:site:enable'
    invoke 'nginx:restart'
  end

  desc 'Install npm modules'
  task :npm_install do
    invoke 'npm:install'
  end

  before :updated, :npm_install
  after :publishing, :restart_app
  # after :publishing, :update_nginx
end


namespace :ci do
  desc 'Run all the unitary tests'
  task :unit do
    # execute :npm, 'test:unit'
    system("npm run test:unit")
  end

  desc 'Run all integration tests'
  task :integration do
    # execute :npm, 'test:unit'
    system("npm run test:integration")
  end


  desc 'Run and create the coverage report'
  task :coverage do
    system("npm run coverage")
  end

  desc 'Run the lint using ESLint'
  task :lint do
    system("npm run lint")
  end

  # execute :unit
  # after :unit, :integration
  # after :integration, :coverage
  # after :coverage, :lint

end
