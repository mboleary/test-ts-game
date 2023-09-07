
# Core game libraries
game_event:
	cd package/game_event && \
	npm i && \
	npm run build

game_ecs: game_event
	cd package/game_ecs && \
	npm i && \
	npm run build

game_core: game_event game_ecs
	cd package/game_core && \
	npm i && \
	npm run build

game_core_node: game_core
	cd package/game_core_node && \
	npm i && \
	npm run build

game_core_browser: game_core
	cd package/game_core_browser && \
	npm i && \
	npm run build

# Demos
example_2d_engine: game_core_browser
	cd package/example_2d_engine && \
	npm i && \
	npm run build

example_nodejs_engine: game_core_node
	cd package/example_nodejs_engine && \
	npm i && \
	npm run build

# example_game_pong: game_core_browser
# 	cd package/example_game_pong && \
# 	npm i && \
# 	npm run build

clean:
	cd package/game_event && rm -rf build node_modules
	cd package/game_ecs && rm -rf build node_modules
	cd package/game_core && rm -rf build node_modules
	cd package/game_core_node && rm -rf build node_modules
	cd package/game_core_browser && rm -rf build node_modules
	cd package/example_2d_engine && rm -rf build node_modules
	cd package/example_nodejs_engine && rm -rf build node_modules

