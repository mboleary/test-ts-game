
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

clean:
	cd package/game_core && rm -rf build node_modules
	cd package/game_event && rm -rf build node_modules
	cd package/game_ecs && rm -rf build node_modules

