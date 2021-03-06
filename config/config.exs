# This file is responsible for configuring your application
# and its dependencies with the aid of the Mix.Config module.
#
# This configuration file is loaded before any dependency and
# is restricted to this project.
use Mix.Config

# General application configuration
config :abyss,
  ecto_repos: [Abyss.Repo]

# Configures the endpoint
config :abyss, AbyssWeb.Endpoint,
  url: [host: "localhost"],
  secret_key_base: "b/T/fB/d30EtU/0pOSVYLkJyVCW3QJcz3oVuKBMmJ53pdONFJZ3TojQzCOaR5ge3",
  render_errors: [view: AbyssWeb.ErrorView, accepts: ~w(html json)],
  pubsub: [name: Abyss.PubSub,
           adapter: Phoenix.PubSub.PG2]

# Configures Elixir's Logger
config :logger, :console,
  format: "$time $metadata[$level] $message\n",
  metadata: [:request_id]

# Import environment specific config. This must remain at the bottom
# of this file so it overrides the configuration defined above.
import_config "#{Mix.env}.exs"
